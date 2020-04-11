//Dependencies: 
const express = require('express');
const router = express.Router();
const DataPrepEngine = require('../Tools/DataPrepEngine').DataPrepEngine; 
const NN_Engine = require('../Tools/NN_Engine').NN_Engine; 
const vector = require('../models/vector'); 
const axios = require('axios');


//Helper functions: 

const formatBody = (reqBody) => {
  //Initialize properly formatted input object body: 
  let inputData = {
    mode: null,
    location: null,  
    radius: null, 
    subject: null, 
    hashtagOption1: null, 
    hashtagOption2: null, 
    hashtag1: null, 
    hashtag2: null 
    }; 
  let prepProp = 0; 

  //Loop through request body to assign appropriate values to the inputData object: 
  for (let value in inputData) {
    let reqProp = prepProp.toString(); 
    if (reqBody[reqProp] !== '') {
      inputData[value] = reqBody[reqProp]; 
    }
    prepProp ++; 
  } 

  return inputData; 
}
/**
 * Function reformats request body data object to a format, with properties recognizable by the data processing engine. 
 */



const coinToss = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Returns a value between the minimum and maximum values, like a coin toss. 
 */



async function getNews(newsCategory, res) {
  let newsObject = {}; 

  //try block contains API call to The Guardian News API:
  try {
    //get request to retrieve news articles and process data from the API based on the neural network predicted category: 
    const response = await axios.get('http://content.guardianapis.com/search?section=' + newsCategory  + '&api-key=ae474d61-be3d-47d0-861b-3918af113288')
    const articles = response.data.response.results; 

    //Insert relevant property and data from API response object to a custom newsObject and delete input vector from database: 
    for (let i = 0; i < 3; i++) {
      newsObject['news'+ i] = articles[i]; 
    }
    await dbDelete(vector); 
    return newsObject
  } 
  //catch block to catch and return error code to frontend in case of error in the API call: 
  catch (error) {
    let code = 500;
    res.json({code: code})      
  }
}
/*
 *Function makes an API call to The Guardian API, based on the neural network prediction. 
 *News is formatted and the database is cleared, while the response is returned to the frontend.  
 */


const dbDelete = () => {
  vector.deleteMany({label: 'Prediction'}, (err) => {
    if (err) {
        return err; 
    } else {
        console.log('Deleted'); 
    }
  })
}; 
/*
 * Makes a delete call to the proper collection to delete prediction input vectors.
 */


//Root route for production build of React frontend: 
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
/**
 * Link backend express server to index file in 'build' folder. 
 */



//Tweet Post Route: 
router.post('/tweetPost', function(req, res, next) {
    //Format POST data and perform operations to get tweets and convert to input vector: 
    const inputData = formatBody(req.body)
    const prepEngine = new DataPrepEngine(inputData);
    prepEngine.process(res); 
}); 

/**
 * Request body is reformatted and placed into the DataPrepEngine instance. 
 * DataPrepEngine organizes the information into a search query that gathers tweets according to search filtering parameters. 
 * Tweets are cleaned of 'noise' (emojis, special characters, etc) and converted (vectorized) into a numerical form. 
 * This vector is stored into the mongo database for processing in the next route.  
 */


//Tweet Augment Post Route: 
router.post('/tweetAugment', function(req, res, next) {
  //Prepare PrepEngine to augment via signal: 
  const signal = 'augment';
   
  //Process as before:
  const inputData = formatBody(req.body)
  const prepEngine = new DataPrepEngine(inputData);
  prepEngine.process(res, signal);  
}); 

/**
 * Similar to the above tweetPost route, but also adds an 'augment' signal to the route. 
 * This signal triggers code that augments and updates a currently existing input vector in the database. 
 * Only triggered upon pressing the 'augment' button on the frontend. 
 */


//New Search Route: 
router.get('/newSearch', async (req, res, next) => {
  try {
    await dbDelete();
    res.json({code: 200}) 
  } catch (error) { 
    res.json({code: 500, message: 'Something went wrong!'})
  }
}) 

/**
 * Delete route that is triggered whenever the appropriate component is triggered on the frontend. 
 * The culmulative input vector is deleted from the database. 
 * This creates a 'blank slate' for a new series of searches to begin.
 */


//News Get Route: 
router.get('/getNews', async function(req, res, next) {
    //Predict news category from input vector: 
      const MLEngine = new NN_Engine();
      const sciTechList = ['science', 'technology'];  
      let newsCategory = await MLEngine.predictCategory(); 
      
      if (newsCategory === "science and technology") {
        let subCategory = coinToss(0, 1); 
        newsCategory = sciTechList[subCategory]; 
      }
      //Get News based off of predicted category:
      const newsAtricles = await getNews(newsCategory, res);
      res.json({response: newsAtricles, code: 200}); 
})


/**
 * The Machine Learning Engine (MLEngine) is instantiated to predict the news category, based off of the news input vector stored in the database. 
 * The MLEngine is trained on 'Science and Technology' as a composite category, but the guardian list 'Science' and 'Technology' as separate categories. 
 * Thus, a random choice is made between the two sub-categories.  These two sub-categories were too similar in content to train the neural netwwork to reliably recgonize the difference.  
 * The predicted news category is used in a GET request made to The Guardian API and the data is formatted and returned to the frontend. 
 * 
 * Issue: The articles returned are going to be the same each time if the same category is used.  This can be rectified later, perhaps through the use of additional parameters in the GET call.  
 */


module.exports = router;