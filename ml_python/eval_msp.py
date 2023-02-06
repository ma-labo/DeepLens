import argparse
import os
import fire

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import (DataLoader, RandomSampler, TensorDataset, SequentialSampler)
import torch.nn.functional as F
from tqdm import tqdm

from transformers import (AutoTokenizer, AutoModelForSequenceClassification)
from transformers import set_seed


SAVE_PATH = './data/generated_data_files/'
if not os.path.exists(SAVE_PATH):
    os.makedirs(SAVE_PATH)
    
label_map = {
        '0': 'Company',
        '1': 'EducationalInstitution',
        '2': 'Artist',
        '3': 'Athlete',
        '4': 'OfficeHolder',
        '5': 'MeanOfTransportation',
        '6': 'Building',
        '7': 'NaturalPlace',
        '8': 'Village',
        '9': 'Animal',
        '10': 'Plant',
        '11': 'Album',
        '12': 'Film',
        '13': 'WrittenWork',
}

def merge_acc_data(acc_file, data_file, np_file, fname):
    df1 = pd.read_csv(acc_file, sep="\n", names=['content'])
    df1[['pred', 'groudtruth_label']] = df1.content.str.split(',', expand=True)

    df2 = pd.read_csv(data_file)
    df2['pred'] = df1['pred']
    np_data = np.load(np_file)
    dfnp = pd.DataFrame(data=np_data, columns=["msp"])
    df2['msp'] = dfnp
    df2['ood_score'] = df2['msp'].apply(lambda x: round(1 - x, 4))
    df2.to_csv(os.path.join(SAVE_PATH, f'{fname}_result.csv'), index=False)


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

def process_lm_dataset(dataset_path, tokenizer, padding, max_length, batch_size, truncation=True, num_label_chars=1, n=None, shuffle=False):
    df = pd.read_csv(dataset_path)
    dataset_texts = df['text'].values.tolist()
    labels = df['label'].values.tolist()
    dataset_texts, labels = dataset_texts[:n], labels[:n]
    args = ((dataset_texts,))
    if len(labels) == 0:
        labels = None
    return get_dataloader(args, tokenizer, padding, max_length, batch_size, truncation=truncation, labels=labels, shuffle=shuffle)


def eval(model, eval_loader, device, fname, criterion=nn.CrossEntropyLoss(), with_labels=True):
    probs = None
    gold_labels = None

    eval_loss = 0
    step = None
    eval_iterator = tqdm(eval_loader, desc='Evaluating')
    for step, batch in enumerate(eval_iterator):
        model.eval()
        batch = tuple(t.to(device) for t in batch)
        
        with torch.no_grad():
            # ===== Calculate MSP =====
            inputs = {'input_ids': batch[0].to(device), 'attention_mask': batch[1].to(device)}
            out = model(**inputs)[0].double()
            out = F.softmax(out, dim=1)
            if with_labels:
                labels = batch[2].to(device)
                loss = criterion(out, labels)

            if probs is None:
                probs = out.detach().cpu().numpy()
                if with_labels:
                    gold_labels = labels.detach().cpu().numpy()
            else:
                probs = np.append(probs, out.detach().cpu().numpy(), axis=0)
                if with_labels:
                    gold_labels = np.append(gold_labels, labels.detach().cpu().numpy(), axis=0)

            if with_labels:
                eval_loss += loss.item()
    
    if with_labels:
        eval_loss /= (step+1)
        print('eval loss: {}'.format(eval_loss))

        # compute accuracy
        preds = np.argmax(probs, axis=1)

        pred_label_df = pd.DataFrame({'pred': preds, 'label': gold_labels}, columns=['pred', 'label'])
        pred_label_df.to_csv(os.path.join(SAVE_PATH, f'{fname}_accuracy.csv'), index=False, header=False)
        accuracy = np.sum(preds == gold_labels)/len(preds)
        print('eval accuracy: {}'.format(accuracy))
        
    return probs

def main():
    # create argument parser
    parser = argparse.ArgumentParser()
    
    parser.add_argument('--max_seq_length', type=int, default=None, help='Maximum sequence length of the inputs')
    parser.add_argument('--batch_size', type=int, default=16, help='Batch size')
    parser.add_argument('--seed', type=int, default=42, help='Random seed for initialization')
    parser.add_argument('--val_file', type=str, default=None, help='input file')
    parser.add_argument('--fname', type=str, default=None, help='output file')
    parser.add_argument('--model_dir', type=str, default=None, help='model path')
    parser.add_argument('--n', type=int, default=None, help='Number of examples to process (for debugging)')

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

    model = AutoModelForSequenceClassification.from_pretrained(args.model_dir)
    model.to("cuda:1")

    # process dataset
    print('Processing dataset')

    padding = 'max_length'
    
    if args.val_file is not None:
        eval_loader = process_lm_dataset(args.val_file, tokenizer, padding, args.max_seq_length, args.batch_size, n=args.n)
    else:
        eval_loader = None
        

    # instantiate optimizer and criterion
    criterion = nn.CrossEntropyLoss()

    # evaluate model
    if eval_loader is not None:
        print('Evaluating model')
        probs = eval(model, eval_loader, device, args.fname, criterion)
        np.save(os.path.join(SAVE_PATH, f'{args.fname}_probs'), probs)
        msp = np.max(probs, axis=1)
        if args.fname is not None:
            np.save(os.path.join(SAVE_PATH, f'{args.fname}_msp'), msp)
            merge_acc_data(
                os.path.join(SAVE_PATH, f'{args.fname}_accuracy.csv'), 
                args.val_file, 
                os.path.join(SAVE_PATH, f'{args.fname}_msp.npy'),
                args.fname
            )

if __name__ == '__main__':
    main()
    print("\n\n--------DONE--------")
