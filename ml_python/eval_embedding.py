import argparse
from email.header import Header
import os

import numpy as np
import pandas as pd
import umap.umap_ as umap

import torch
import torch.nn as nn
from torch.utils.data import (DataLoader, RandomSampler, TensorDataset, SequentialSampler)
import torch.nn.functional as F
from tqdm import tqdm

from transformers import (AutoTokenizer, AutoModelForSequenceClassification)
from transformers import set_seed
from simpletransformers.classification import ClassificationModel

from sklearn import metrics
from sklearn.decomposition import PCA
from sklearn.cluster import DBSCAN
from sklearn.manifold import TSNE
from sklearn.manifold import MDS
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer

import matplotlib.pyplot as plt
import json
from utils import text_to_id_lable_map

SAVE_PATH = './data/'
if not os.path.exists(SAVE_PATH):
    os.makedirs(SAVE_PATH)

def get_dataloader(tokenizer_args, tokenizer, padding, max_length, batch_size, truncation=True, labels=None, shuffle=False):
    features = tokenizer(*tokenizer_args, padding=padding, max_length=max_length, truncation=truncation)
    all_input_ids = torch.tensor([f for f in features.input_ids], dtype=torch.long)
    all_attention_mask = torch.tensor([f for f in features.attention_mask], dtype=torch.long)

    if labels is not None:
        all_labels = torch.tensor([f for f in labels], dtype=torch.long)
        tensor_dataset = TensorDataset(all_input_ids, all_attention_mask, all_labels) 
    else:
        tensor_dataset = TensorDataset(all_input_ids, all_attention_mask) 

    if shuffle:
        sampler = RandomSampler(tensor_dataset)
    else:
        sampler = SequentialSampler(tensor_dataset)

    dataloader = DataLoader(tensor_dataset, sampler=sampler, batch_size=batch_size)
    return dataloader

def process_lm_dataset(dataset_path, tokenizer, padding, max_length, batch_size, truncation=True, n=None, shuffle=False):
    df = pd.read_csv(dataset_path)
    dataset_texts = df['text'].values.tolist()
    labels = df['label'].values.tolist()
    dataset_texts, labels = dataset_texts[:n], labels[:n]
    args = ((dataset_texts,))
    if len(labels) == 0:
        labels = None
    return get_dataloader(args, tokenizer, padding, max_length, batch_size, truncation=truncation, labels=labels, shuffle=shuffle)

def kmeans_cluster(dim_reduct_method, projection_result, data_frame, dataset_name):
    labels = data_frame['label']
        
    u_labels = np.unique(labels)

    true_k = u_labels.shape[0]

    km = KMeans(
        n_clusters=true_k,
        init="k-means++",
        max_iter=200,
        n_init=1,
        verbose=False,
    )
    projection_result = np.array(projection_result)
    print("projection_result shape: ", projection_result.shape)
    cluster_pred_labels = km.fit_predict(projection_result)
    print("cluster_pred_labels: ", cluster_pred_labels)
    print("labels: ", labels)
    print("unique true label ", u_labels)
    
    x = projection_result[:, 0]
    y = projection_result[:, 1]
    z = projection_result[:, 2]

    data_frame['cluster'] = cluster_pred_labels
    data_frame['x'] = x
    data_frame['y'] = y
    data_frame['z'] = z
    data_frame.to_csv(os.path.join(SAVE_PATH, f'results//{dataset_name}_{dim_reduct_method}_cluster.csv'), index=False)
    
    # === create cluster dict for testing purpose ======
    # clustered_data = {}
    # for i in range(len(u_labels)):
    #     clustered_data[i] = []
    # for i, d in enumerate(ood_data):
    #     d['clusted_label'] = cluster_pred_labels[i]
    #     clustered_data[cluster_pred_labels[i]].append({"text": d['text'], "groudtruth_label": d['groudtruth_label']})
        
    # json_string = json.dumps(clustered_data)
    # with open(os.path.join(SAVE_PATH, 'generated_data_files/output_cluster.json', 'w', encoding='utf-8')) as outfile:
    #     outfile.write(json_string)
    # ================
    
    # === create cluster projection figure for testing purpose ======
    fig = plt.figure(figsize=(20, 20), dpi=150)
    ax = fig.add_subplot(111, projection='3d')
    ax.scatter(x,y,z, marker="o", c=labels, cmap="RdBu")
    plt.savefig(os.path.join(SAVE_PATH, f'generated_data_files/{dataset_name}_{dim_reduct_method}.png'))
    
    
def pca_process(X, dim):
    pca = PCA(n_components=dim)
    result = pca.fit_transform(X)
    print(result.shape)
    print(pca.components_.shape)
    print(pca.explained_variance_)
    print(pca.explained_variance_ratio_)
    # print(pca, pca.shape)
    return result

def tsne_process(X, dim):
    tsne = TSNE(n_components=dim, method='exact').fit_transform(X)
    # print(tsne, tsne.shape)
    return tsne

def umap_process(X, dim):
    umap_reuslt = umap.UMAP(n_components=dim).fit_transform(X)
    # print(umap_reuslt, umap_reuslt.shape)
    return umap_reuslt

def mds_process(X, dim):
    mds_reuslt = MDS(n_components=dim).fit_transform(X)
    # print(umap_reuslt, umap_reuslt.shape)
    return mds_reuslt

def eval(model, eval_loader, dim_reduct_method, val_file, dataset_name):
    dim_reduce_result = None

    eval_iterator = tqdm(eval_loader, desc='Evaluating')
    for step, batch in enumerate(eval_iterator):
        batch = tuple(t for t in batch)
        
        with torch.no_grad():
            inputs = {'input_ids': batch[0], 'attention_mask': batch[1]}
            output = model.model.bert(inputs['input_ids'], attention_mask=inputs['attention_mask'])
            X = output[1].detach().cpu().numpy()
            
            if dim_reduce_result is None:
                dim_reduce_result = X
            else:
                dim_reduce_result = np.concatenate((dim_reduce_result, X), axis=0)
    
    
    dim_reduct_result = None
    dim_reduct_target = 512
    if dim_reduct_method == 'pca':
        dim_reduct_result = pca_process(dim_reduce_result, dim_reduct_target)
    elif dim_reduct_method == 'tsne':
        dim_reduct_result = tsne_process(dim_reduce_result, dim_reduct_target)
    elif dim_reduct_method == 'umap':
        dim_reduct_result = umap_process(dim_reduce_result, dim_reduct_target)
    elif dim_reduct_method == 'mds':
        dim_reduct_result = mds_process(dim_reduce_result, dim_reduct_target)
    
    print("dim_reduct_result shape: ", dim_reduct_result.shape)
    
    np.save(os.path.join(SAVE_PATH, f'generated_data_files/{dataset_name}_{dim_reduct_method}'), np.array(dim_reduct_result))
    
    df = pd.read_csv(val_file)
    # kmeans cluter
    kmeans_cluster(dim_reduct_method, dim_reduct_result, df, dataset_name)
    
def main():
    # create argument parser
    parser = argparse.ArgumentParser()

    parser.add_argument('--max_seq_length', type=int, default=None, help='Maximum sequence length of the inputs')
    parser.add_argument('--batch_size', type=int, default=16, help='Batch size')
    parser.add_argument('--seed', type=int, default=42, help='Random seed for initialization')
    parser.add_argument('--val_file', type=str, default=None, help='LM json file')
    parser.add_argument('--fname', type=str, default=None, help='MSP output file')
    parser.add_argument('--dim_reduct_method', type=str, default='pca', help='Dim reduction method')
    parser.add_argument('--model_dir', type=str, default=None, help='model path')
    parser.add_argument('--dataset', type=str, default=None, help='dataset name')

    args = parser.parse_args()

    # set device
    device = torch.device('cuda:1' if torch.cuda.is_available() else 'cpu')
    
    # load dataset
    print('Loading dataset')
        
    # set seed
    set_seed(args.seed)

    # load bert tokenizer and model
    print('Loading bert tokenizer and model')

    tokenizer = AutoTokenizer.from_pretrained(args.model_dir)

    model = ClassificationModel("bert", args.model_dir, use_cuda=True, cuda_device=1)

    # process dataset
    print('Processing dataset')

    padding = 'max_length'
    
    eval_loader = process_lm_dataset(args.val_file, tokenizer, padding, args.max_seq_length, args.batch_size)

    # evaluate model
    if eval_loader is not None:
        eval(model, eval_loader, args.dim_reduct_method, args.val_file)


if __name__ == '__main__':
    main()
    print("\n\n--------DONE--------")

