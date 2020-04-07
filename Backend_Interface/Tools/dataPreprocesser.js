const cleaner = require('./cleaner').Cleaner; 
const wordMap = require('../models/wordMap');
const vector = require('../models/vector'); 


//Preprocessor Setup: 

class Preprocessor {
    constructor() {
        this.cleaner = new cleaner(null); 
    }


    async cleanAndVectorize(tweets, signal) {
        try {
            let container = []

            //Load and Clean Tweets to cleaner class: 
            this.cleaner.switchList(tweets)
            const cleanedTweets = await this.cleaner.clean();

            //Aggregate tweets and convert to input vector: 
            const tweetDoc = cleanedTweets.reduce((current, combined) => combined.concat(current));
            container.push(tweetDoc);  
            let vector = await this.vectorize(container); 

            //Update input vector if necessary: 
            if (signal === 'augment') {
                const combined = await this.augment(vector);
                vector = [combined]; 
            }

            //Store Vectors in DB Collection: 
            this.storeVector(vector); 
            return 'done';     

        } catch (error) {
            //Prepare error information in case if error occurs during cleaning and vectorizing process: 
            error.status = 500;
            error.message = 'Something went wrong.  Please do another search using a different search term';   
            return error;   
        }        
    }
    /** 
     * Method cleans tweets of 'data noise', vectorizes tweets to numerical form, and stores tweet into a database collection. 
     * Method also account for 'data augmentation' if the front end specifies an 'augment search'. 
     * Generic 500 code error handling is provided for basic error handling purposes. 
     * See readMe for information on the purposes of vectorization and cleaning, especially regarding the quality of the data. 
    */
    
    async augment(vec) {
        let combinedVec = []; 

        //Find initial vector in db and isolate: 
        const initialEntry = await vector.find({label: "Prediction"}); 
        const initialVec = initialEntry[0].vector; 
        

        //Loop through vectors and add elements to each other: 
        for (let i in vec[0]) {
            let combinedEl = vec[0][i] + initialVec[i];
            combinedVec.push(combinedEl); 
        }

        //Delete initial input vector from the db collection and return combined input array: 
        await this.dbDelete(); 
        return combinedVec;
    }

    /** 
     * A specially adapted method that combines new input vector information with currently stored input vector information.
     * The old input vector is deleted to make room for the new input vector.
     * This method is invoked in case of a 'data augmentation' call from the frontend of the web app. 
     * The backend is designed to use only one input vector, which is why the old stored input vector data is combined with the newly arrived input vector.
     * See readMe for information on why data augmentation in neural network functionality and prediction accuracy. 
    */


    async vectorize (docArray) {
        //Array container initializations: 
        let docWordCollection = docArray; 
        let docVectors = [];  
    
        //Iterate over document collection to create docVectors array: 
        for (let document of docWordCollection) {
            //Reinitialize word map with a new call to the cut corpus: 
            let dbCall = await wordMap.find({representation: "cut corpus"});
            let docMap = dbCall[0].wordMap; 
    
            //Create dictionary and iterate through each document blob: 
            let dictionary = Object.keys(docMap);
            document.forEach(word =>{
                //Increment the word frequency if a match is found: 
                if (dictionary.includes(word)) {
                    docMap[word] ++; 
                } 
            });
            //Push the document word map to the appropriate vector array: 
            docVectors.push(Object.values(docMap));  
        }
        
        return docVectors; 
    }
    /** 
     * Method vectorizes the cleaned tweet words into a vector (numerical) form. 
     * A stored word map object is used as a template in order to 'count' relevant words that occur in the incoming tweets. 
     * The word map is referred to as a 'dictionary' because these are the subject specific words the neural network is trained to recognize. 
     * The word map is used to 'count' the relevant words in the tweet text content in order to construct the input vector. 
     * See the readMe for an explanation about why a 'dictionary' of words is used in this neural network training. 
     * See the wordMap model for info on the word map construction. 
    */


    async storeVector(input) {
        //Iterate over inputs
        for (let i in input) {
              //Instantiate Model:  
              const newVector = new vector({
                vector: input[i], 
                label: 'Prediction'
            }); 
    
            //Save Vector:
            await this.saveToDB(newVector, 'Vector'); 
        }
    }
    /** 
     * Stores the input vector to the database collection as a model under the label "Prediction".
    */

    saveToDB(model, saveType) {
        model.save((err, result) => {
            if (err) {
                console.log(err); 
            }
            else {
                console.log(`${saveType} Saved to Database`); 
            }
        });
    }
    /** 
     * Invoked to store a model to the appropriate mongo database collection. 
    */

    dbDelete = () => {
        vector.deleteMany({label: 'Prediction'}, (err) => {
          if (err) {
              console.log(err); 
          } else {
              console.log('Deleted'); 
          }
        })
      }; 
    /** 
     * Deletes the stored input vector if invoked. 
    */
}

/** dataPreProcessor:  
 *  This class is a sub-component to the DataPrepEngine class responsible for cleaning the tweet data, vectorizing it and storing it into the app database. 
 *  This 'lower level' class makes use of two key techniques in machine learning natural language analysis: data augmentation and data preprocessing. 
 *  'Data augmentation' involves increasing the 'amount' of data, which the 'augment' logic in this class accomplishes by 'adding' tweet data to the current input vector information. 
 *  'Data preprocesisng' involves scrubbing the words for 'noise' that would lower the accuracy of the neural network prediction. 
 *  These techniques are used in this class to optimize data for the neural network analysis. 
*/

module.exports.Preprocessor = Preprocessor; 