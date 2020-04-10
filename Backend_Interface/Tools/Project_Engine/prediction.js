//Dependencies: 
const mongoose = require('mongoose'); 
const vector = require('../../Data_Collection/predictionVector');  
const tweet = require('../../Data_Collection/TweetModels');  
const tf = require('../Example_Engine/node_modules/@tensorflow/tfjs-node'); 


//DB Set-up: 
mongoose.connect('mongodb://localhost/tweetData'); 

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection successful');
});


//Important Variables: 
const labels = ['World Affairs', 'Science and Technology', 'Business', 'Football', 'Environment']; 
const loadingKey = 'file://'+__dirname+'/NN_Weights/model.json'; 



//Model and Helper Functions: 

async function modelLoading(loadingKey) {
    const loadedNetwork = await tf.loadLayersModel(loadingKey); 
    const optimizer = tf.train.adam(); 
    loadedNetwork.compile({
        loss: 'categoricalCrossentropy', 
        optimizer, 
        metrics: ['acc'],
    }); 
    return loadedNetwork
}

function featureLabelSplit(loadedData) {
    //Initialize Data: 
    let featureVectors = []; 
    let labelValues = []; 

    //Iterate through the data: 
    loadedData.forEach(vectorObject => {
        //For every db extracted object, iterate through the object properties: 
        for (let prop in vectorObject) {
            //Isolate vectors to feature array:
            if (prop === 'vector') {
                featureVectors.push(vectorObject[prop]);
            }
            
            if (prop === 'label') {
                //Isolate associated labels to label array: 
                labelValues.push(vectorObject[prop]); 
            }
        }
    })

    return {features: featureVectors, labels: labelValues}; 
}


function normalise(tensor, previousMin = null, previousMax = null) {
    const min = previousMin || tensor.min();
    const max = previousMax || tensor.max();
    const normalisedTensor = tensor.sub(min).div(max.sub(min));
    return {
      tensor: normalisedTensor,
      min,
      max
    };
  }


function encodeLabels(labels) {
    //Create copy of input array: 
    let labelArray = labels; 

    //Iterate over labels array: 
    for (let i in labelArray) {
        //Look for label category matches and splice generalized integer encoding in place of string label: 
        if (labelArray[i].includes('World Affairs')) {
            labelArray.splice(i, 1, 0);
        }

        else if (labelArray[i].includes('Science and Technology')) {
            labelArray.splice(i, 1, 1);
        }

        else if (labelArray[i].includes('Business')) {
            labelArray.splice(i, 1, 2);
        }

        else if (labelArray[i].includes('Football')) {
            labelArray.splice(i, 1, 3);
        }

        else if (labelArray[i].includes('Environment')) {
            labelArray.splice(i, 1, 4);
        }
    }

    return labelArray;  
}


function resultSort(results) {
    let temporary = [];
    let sorted = [];   

    //Divide Results into blocks of 5: 
    for (let i = 0; i <= results.length; i++) {
        temporary.push(results[i]);
        if (i % 5 === 0) {
            let slice = temporary.slice(i - 5, i);  
            sorted.push(slice);  
        }
    }
    
    //Remove the first empty array: 
    sorted.shift(); 

    //Classify Results: 
    sorted.forEach((result, i) => {
        const max = Math.max(...result); 
        const labelIndex = result.indexOf(max);
        sorted.splice(i, 1, labels[labelIndex]); 
    })

    return sorted; 
}



//Main Program NN Flow: 

async function runPrediction() {
    //Load model into program: 
    const model = await modelLoading(loadingKey);

    //Load tweets from DB and shuffle: : 
    const loadedData = await vector.find({killSwitch: 'kill'});  

    tf.util.shuffle(loadedData); 

    //Tensor preparations: 
    const splitData = featureLabelSplit(loadedData); 
    const features = splitData.features;
    const Labels = splitData.labels;   

    const fTensor = tf.tensor2d(features);
    const normalisedFeatures = normalise(fTensor).tensor;
    const renamedLabels = encodeLabels(Labels); 

    const lTensor = tf.tensor1d(renamedLabels, 'int32'); 
    const oneHotLabels = tf.oneHot(lTensor, 5); 


    //Prediction Runs: 
    const predictionTensor = await model.predict(normalisedFeatures); 

    //predictionTensor.print(); 
    //oneHotLabels.print(); 


    //Data Conversions: 
    const predictions = predictionTensor.dataSync(); 
    const predTopics = resultSort(predictions);
    
    for (let i in predTopics) {
        console.log(`Predicted: ${predTopics[i]}`, `True: ${labels[Labels[i]]}`); 

    }
     


}

runPrediction(); 

/**
 * A successful NN engine has been created for this app.  
 * The engine predicts to a good level of accuracy for the selected tweets. 
 * However, the engine may not predict well for all tweet batches.  
 */
