import ecco as eccoLib
import json
import argparse


def get_sentence_neuron_activity(dataset_name, is_test):
    dataset_texts = []
    is_test_str = 'test'
    if is_test == 0:
        is_test_str = 'train'
    with open(f'../../dashboard/src/data/{dataset_name}/{is_test_str}.json', encoding='utf-8') as f:
        data = json.load(f)
        for d in data:
            dataset_texts.append(d['text'].lstrip())
    dataset_texts = dataset_texts
    results = {}
    for i, text in enumerate(dataset_texts):
        if (i >= 0 and i < 2000):
            print(i)
            lm = eccoLib.from_pretrained('distilbert-base-uncased', activations=True)
            inputs = lm.tokenizer([text], return_tensors="pt")
            output = lm(inputs)
            nmf_1 = output.run_nmf(n_components=8)
            result = nmf_1.explore(top_k=10, filter_token=True)
            results[i] = result
        
    with open(f'../../dashboard/src/data/{dataset_name}/ecco/{is_test_str}.json', 'a', encoding='utf-8') as outfile:
        json_string = json.dumps(results)
        outfile.write(json_string)


def main():
    # create argument parser
    parser = argparse.ArgumentParser()

    parser.add_argument('--dataset', type=str, default=None, help='dataset name')
    parser.add_argument('--is_test', type=int, default=1, help='train / test flag')
    args = parser.parse_args()
    get_sentence_neuron_activity(args.dataset, args.is_test)


if __name__ == '__main__':
    main()
    print("\n\n--------DONE--------")