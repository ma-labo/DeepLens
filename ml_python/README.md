# DeepLens ML Model

These steps show how to fine-tune BERT model with first 4 classes of DBPedia14 dataset, and evaluated against all 14 classes.

#### Python >= 3.6

*We suggest use virtual environment to avoid messing up your own environments.*

Please install python dependencies via:
```
pip install -r requirements.txt
```

To train the model, use
```
mkdir output/dbpedia_bert

python bert_fine_tune.py --train_file data/dbpedia/train.csv --output_dir output/dbpedia_bert/ --num_labels 4
```

To find Maximum Softmax Probability (MSP), use

```
python eval_msp.py --val_file data/dbpedia/test.csv --fname dbp_test --model_dir output/dbpedia_bert/model

python eval_msp.py --val_file data/dbpedia/train.csv --fname dbp_train --model_dir output/dbpedia_bert/model
```

To generate cluster result from embedding layer with different dimension reduction method, use 
```
python eval_embedding.py --val_file data/dbpedia/generated_data_files/dbp_test_result.csv --dim_reduct_method pca --dataset dbpedia
```
You can replace pca with umap or tsne.


Webapp requires json file when showing the data. To convert the training and test data files (./data/dbpedia/generated_data_files/dbp_train_result.csv, ./data/dbpedia/generated_data_files/dbp_train_result.csv) from csv to json, there are two options:

1. Using https://csvjson.com/

2. Using https://www.npmjs.com/package/convert-csv-to-json

Then save the generated json file to DEEPLENS/dashboard/src/data/dbpedia_14/dbpedia_train_data.json and DEEPLENS/dashboard/src/data/dbpedia_14/dbpedia_test_data.json

To generate ECCO word salient analysis result, use
```
pip install -e ./ecco/eccoLib 

python ecco/ecco_generator.py --dataset dbpedia --is_test 1
```

To gernerate word cloud for each cluster, use 
```
python eval_extract_keywords.py --dataset dbpedia
```

Congratulations, you finished the setup. Now you can start the dashboard with your own example. 


