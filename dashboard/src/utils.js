export var getAllKeywords = async function () {
    const axios = require('axios');
    var i = 0
    let list = []
    let keywords = []
    for (i = 0; i < 14; i++) {
        axios.get('http://127.0.0.1:5000/keywords?method=tfidf&cluster_label=' + i)
            .then(function (response) {
                // handle success
                list = response.data
                keywords.push(list.toString())
            })
            .catch(function (error) {
                // handle error
                console.log(error);

            })
            .then(() => {
            });
    }

    return (
        keywords

    );
};

export var getKeywordByCluster = async function (cluster, setCurrentClusterKeywords) {
    const axios = require('axios');
    // axios.get('http://127.0.0.1:5000/keywords?method=tfidf&cluster_label=' + cluster)
    axios.get('http://127.0.0.1:5000/keywords?cluster_label=' + cluster)
        .then(function (response) {
            // handle success
            // setCurrentClusterKeywords(response.data);
            console.log("check response ", response)
            return response.data

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};


export var getLabels = function () {
    const axios = require('axios');
    var i = 0
    let list = []
    let labels = []
    for (i = 0; i < 14; i++) {
        axios.get('http://127.0.0.1:5000/keywords?method=tfidf&cluster_label=' + i)
            .then(function (response) {
                // handle success
                list = response.data
                labels.push(i + " " + list[0] + "/" + list[1])
            })
            .catch(function (error) {
                // handle error
                console.log(error);

            })
            .then(() => {
            });
    }
    console.log("getLabels" + labels)

    return (
        labels
    );
};