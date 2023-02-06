import argparse
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import json
from wordcloud import WordCloud, STOPWORDS


def word_cloud(data, label, dataset_name):
    text_arr = data[label]
    text = ""
    for i in text_arr:
        text += i + "\n"
    stopwords = set(STOPWORDS)
    # Generate a word cloud image
    wc = WordCloud(max_words=10, background_color="white", stopwords=stopwords,
               random_state=1, margin=10, width=480, height=120, colormap="tab10").generate(text)


    wc.to_file(f'../dashboard/src/data/{dataset_name}/keywords_images/word_cloud_cluster_{label}.png')

def main():
    # create argument parser
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', type=str, default=None, help='dataset name')

    args = parser.parse_args()
    
    json_data = None
    
    with open(f'../dashboard/src/data/{args.dataset}/test.json', encoding='utf-8') as f:
        json_data = json.load(f)
    text = []
    text_dict = {}

    for i, d in enumerate(json_data):
        if d['cluster'] in text_dict:
            text_dict[d['cluster']].append(d['text'])
        else:
            text_dict[d['cluster']] = [d['text']]
        text.append(d['text'] + "\n")
    
    data_str = ""
    for i in text:
        data_str += i
    for k in text_dict.keys():
        word_cloud(text_dict, k, args.dataset)
    

if __name__ == '__main__':
    main()
    print("\n\n--------DONE--------")

