//Dependencies: 
const mongoose = require('mongoose'); 
const vector = require('../../Data_Collection/vector');  
const tweet = require('../../Data_Collection/TweetModels');  
const tf = require('../Example_Engine/node_modules/@tensorflow/tfjs-node'); 

//Database Connection Setup: 

mongoose.connect('mongodb://localhost/tweetData'); 

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection successful');
});


//Important Variables: 
const labels = ['World Affairs', 'Science and Technology', 'Business', 'Football', 'Environment']; 
const storageID = 'file://'+__dirname+'/NN_Weights'; 
const loadingKey = 'file://'+__dirname+'/NN_Weights/model.json'; 


//Helper Functions: 

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

function trainingTestingSplit(dataSet, testingLimit) {
    //Initialize Container Arrays: 
    let testSet = [];
    let trainingSet = []; 

    //Iterating over the data set: 
    for (let i in dataSet) {
        //Sort input object into training / testing sets based specific testing limit value: 
        const inputObj = dataSet[i]; 

        if (i < testingLimit) {
            testSet.push(inputObj); 
        } else {
            trainingSet.push(inputObj); 
        }
    }

   return {training: trainingSet, testing: testSet}; 
}; 


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


//Model Specific Functions: 

function createModel(inputShape) {
    //Instantiation of Sequential Model: 
    const model = tf.sequential(); 

    //Define NN Architecture: 
    model.add(tf.layers.dense({
        inputShape: [inputShape],
        units: 120, 
        useBias: true, 
    })); 

    model.add(tf.layers.dense({
        units: 100, 
        kernelRegularizer: 'l1l2', 
        activation: 'relu',
        useBias: true, 
    })); 

    model.add(tf.layers.dense({
        units: 5, 
        activation: 'softmax', 
    })); 

    //Compiling the model: 
    const optimizer = tf.train.adam(); 
    model.compile({ 
        loss: 'categoricalCrossentropy', 
        optimizer, 
        metrics: ['acc'],
    }); 

    return model; 
}

function modelTrain(model, fTensor, lTensor) {
    return model.fit(fTensor, lTensor, {
        epochs: 150,   
        shuffle: true, 
        validationSplit: 0.2, 
        callbacks: {
            onEpochBegin: (epoch, log) => console.log(`This is epoch: ${epoch}`), 
            onEpochEnd: (epoch, log) => console.log(`Loss Report: ${log.loss}`),
            onEarlyStopping: tf.callbacks.earlyStopping({monitor: 'val_acc'}), 
        },
    }); 
}

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


//Main Functions: 

async function run() {

    //Loading the pre-trained model for increment training: 
    //const model = await modelLoading(loadingKey);

    //Load inputs from mongo databse collections: 
    const loadedData = await vector.find({killSwitch: 'kill'});  

    
    //Shuffle the loaded data set: 
    tf.util.shuffle(loadedData); 

    
    //Splitting into Training and Testing sets
    const splitSets = trainingTestingSplit(loadedData, 150); 
    const trainingSet = splitSets.training; 
    const testingSet = splitSets.testing; 




    //Separating the features and labels from the combined input objects: 

    //A. Training Set Separation: 
    const separatedTraining = featureLabelSplit(trainingSet); 
    const trainingFeatures = separatedTraining.features; 
    const trainingLabels = separatedTraining.labels; 


    //B. Testing Set Separation: 
    const separatedTesting = featureLabelSplit(testingSet); 
    const testingFeatures = separatedTesting.features; 
    const testingLabels = separatedTesting.labels; 

   
    //Encoding of Label Values in data sets: 
    const renamedTrainingLabels = encodeLabels(trainingLabels); 
    const renamedTestLabels = encodeLabels(testingLabels); 

    //Creating Initial Feature and Label Tensors: 

    //A. Feature Tensors: 
    const fTensorTraining = tf.tensor2d(trainingFeatures); 
    const ftensorTesting = tf.tensor2d(testingFeatures); 

    //B. Label Tensors: 
    const lTensorTraining = tf.tensor1d(renamedTrainingLabels, 'int32'); 
    const lTensorTesting = tf.tensor1d(renamedTestLabels, 'int32'); 

    //Processing of tensors to final forms: 

    //A. Normalised Feature Tensors: 
    const normalisedTrainingFeatures = normalise(fTensorTraining).tensor;
    const normalisedTestingFeatures = normalise(ftensorTesting).tensor;

    //B. One Hot Encoded Labels: 
    const oneHotTrainingLabels = tf.oneHot(lTensorTraining, 5);
    const oneHotTestingLabels = tf.oneHot(lTensorTesting, 5); 

    //Model Creation (useful for initial training):
    const model = createModel(trainingFeatures[0].length); 

    
    //Model Training / Fitting: 
    const trainedModel = await modelTrain(model, normalisedTrainingFeatures, oneHotTrainingLabels);


    //Loss Reporting: 
    const trainingLoss = trainedModel.history.loss.pop(); 
    console.log(`End Training Set Loss ${trainingLoss}`); 

    const validationLoss = trainedModel.history.val_loss.pop(); 
    console.log(`End Validation Set Loss: ${validationLoss}`);


    //Model Testing: 
    const lossTensor = await model.evaluate(normalisedTestingFeatures, oneHotTestingLabels); 
    const loss = lossTensor[0].dataSync(); 
    const testAccuracy = lossTensor[1].dataSync(); 

    console.log(`Testing set loss: ${loss}`);
    console.log(`Testing Accuracy: ${testAccuracy}`); 


    //Saving the model Results: 
    const saveResults = await model.save(storageID); 
    
}; 


run();


