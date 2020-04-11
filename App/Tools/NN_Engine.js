const vector = require('../models/vector');  
const tf = require('../node_modules/@tensorflow/tfjs-node'); 

//Essential Variables: 
const loadingKey = 'file://'+__dirname+'/Project_Engine/NN_Weights/model.json'; //Contains trained neural network parameter information.  



//Class Specifications: 
class NN_Engine {
    constructor() {
        this.categories = ['global', 'science and technology', 'business', 'football', 'environment']
    }; 

    async predictCategory() {
        //Load Model 
        const model = await this.loadModel(loadingKey);     
        
        //Load tweets from DB and isolate input array:  
        const loadedData = await vector.find({label: 'Prediction'});
        const inputArray = [loadedData[0].vector];

        //Convert input array to tensor and normalise: 
        const inputTensor = tf.tensor2d(inputArray);
        const normalisedInput = this.normalise(inputTensor).tensor;
        normalisedInput.print(); 

        //Run prediction and model and process result to normal array: 
        const predictionTensor = await model.predict(normalisedInput); 
        const prediction = predictionTensor.dataSync(); 

        //Convert result to yield news prediction: 
        const result = this.categorize(prediction);
        return result; 
    }
    /** 
     * Master control method that handles neural network model loading, input data preparation, prediction, and post-prediction functionality. 
     * The input vector must be converted to a 'tensor', the form of input data recognized by the neural network in the TensorFlowJS library of this project.
     * Post data conversion to a usable format is also required for news topic categorization.
     * See readMe for a brief explanation on TFJS and tensors for neural networks.   
    */

    async loadModel(loadingKey) {
        const loadedNetwork = await tf.loadLayersModel(loadingKey);
        const optimizer = tf.train.adam(); 
        loadedNetwork.compile({
            loss: 'categoricalCrossentropy', 
            optimizer, 
            metrics: ['acc'],
        });

        return loadedNetwork; 
    }
    /** 
     * Loads the architecture and parameters of the neural network to the class. 
     * The parameters are the essential characteristics of the neural network that affect its functionality. 
     * No theoretical explanation will be given for this, as it is beyond the scope of the project functionality. 
    */

    normalise(tensor, previousMin = null, previousMax = null) {
        const min = previousMin || tensor.min();
        const max = previousMax || tensor.max();
        const normalisedTensor = tensor.sub(min).div(max.sub(min));
        return {
          tensor: normalisedTensor,
          min,
          max
        };
    }
    /** 
     * Converts all numerical values in tensors to a scale of 0-1 so that the tensor is 'digestible' to the neural network. 
     * Neural networks typically require values between 0-1 in individual numbers in order for data to be processed to predictions. 
    */

    categorize(prediction) {
        const mostProbable = Math.max(...prediction);  
        let maxIndex; 
        prediction.forEach((probability, i) => {
            if (probability === mostProbable) {
                maxIndex = i; 
            }
        }); 
        const predictedCategory = this.categories[maxIndex]; 
        return predictedCategory;  
    }
    /** 
     * Method takes the raw numerical prediction of the tensor and converts this prediction to news category. 
     * This converts the neural network result into a useful result. 
    */
}

/** NN_Engine Class: 
 *  This class is the 'beating heart' of the web app that predicts news categories based on provided tweet information. 
 *  The class loads the neural network and its properties into the instance it is called. 
 *  Input vector information is processed into the final numerical form, called a tensor, which is the required data format for a neural network. 
 *  A prediction is generated from the neural network and post-prediction analysis produces the useful 'News Subject" prediction the rest of the app needs in order to function. 
 *  See readMe file for an explanation of the approach taken to produce this neural network's final 'form'. 
*/

module.exports.NN_Engine = NN_Engine; 