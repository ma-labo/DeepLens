import pandas as pd
from simpletransformers.classification import ClassificationModel
import argparse

import logging


def train(train_file, model_output, num_labels):
    logging.basicConfig(level=logging.INFO)
    transformers_logger = logging.getLogger("transformers")
    transformers_logger.setLevel(logging.WARNING)

    train_df = pd.read_csv(train_file)
    train_df.columns = ["text", "label"]
    
    args = {
        'num_train_epochs': 1,
        'overwrite_output_dir':True,
        'learning_rate': 5e-05,
        'train_batch_size': 16,
        'eval_batch_size': 16,
        'manual_seed': 42,
        'adam_epsilon': 1e-08,
        'optimizer': "AdamW",
        'scheduler': "linear_schedule_with_warmup",
        'warmup_steps': 34650,
    }

    model = ClassificationModel('bert', 'bert-base-uncased', use_cuda=True, cuda_device=0, num_labels=num_labels, args=args)
    model.train_model(train_df, output_dir=model_output)

def main():
    # create argument parser
    parser = argparse.ArgumentParser()

    parser.add_argument('--train_file', type=str, default=None, help='train file')
    parser.add_argument('--output_dir', type=str, default=None, help='model output path')
    parser.add_argument('--num_labels', type=int, default=None, help='num_label')

    args = parser.parse_args()
    train(args.train_file, args.output_dir, args.num_labels)


if __name__ == '__main__':
    main()
    print("\n\n--------DONE--------")

