//Tool Dependencies: 
const Twit = require('../../node_modules/twit-promise');
const mongoose = require('mongoose');
const DataProcessor = require('./dataPreprocesser').Preprocessor; 


//Instantiations: 
const T = new Twit({
    consumer_key:         '3xy04LnYOaKpODIYsF2fpLABq',
    consumer_secret:      '7eu2FqgGuE1EtlgwjTro205Jg3xEpQJ8iMiVO6mxxIoSFUpWs8',
    access_token:         '1212427908901294080-aSPrQh72AQUSLV6ZfpKc4XKdWY2sBz',
    access_token_secret:  'HDOJ825sllT2g3f5lTCNWWfu4iahmCQLGd2CVe249oyS2',
}); 


//Setting up Mongoose Connection:


mongoose.connect(process.env.MONGODB_URI); 

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection successful');
});


//Data Engine Class Set Up: 


class DataPrepEngine {
  constructor(urlInputs) {
    this.searchParams = this.constructURL(urlInputs);
    this.Preprocessor = new DataProcessor(); 
  }

  async constructURL(inputInfo) {
    let searchObject = {}; 

    //Run check for null values and remove them: 
    for (let prop in inputInfo) {
      if (inputInfo[prop] === null) {
        delete inputInfo[prop]; 
      }
    }

    //Verify the selected search/filtering modes and conditionally add search parameters to searchObject:   
    const propValues = Object.values(inputInfo);

    if (inputInfo.hashtagOption1 === true) { 
      if (inputInfo.hashtag1 && inputInfo.hashtag2) {
        //Account for possibility of varying combinations of filled hashtags inputs: 
        searchObject.q = `${inputInfo.subject} #${inputInfo.hashtag1} #${inputInfo.hashtag2}`; 
      } else {
        searchObject.q = `${inputInfo.subject} #${inputInfo.hashtag1 || inputInfo.hashtag2}`
      }      
    } 
    else if (inputInfo.hashtagOption2 === true) {
      searchObject.q = inputInfo.subject; 
    }

    //Add the required search parameters to searchObject: 
    searchObject.lang = 'en'; 
    searchObject.count = 100;

    if (propValues.includes('geographical')) {
      //Perform geolocation search and obtain coordinates (Append to searchObject): 
      const geoCode = await this.getCoordinates(inputInfo.location, {}); 
      searchObject.geocode = geoCode.lat.toString() + ',' + geoCode.long.toString() + ',' + inputInfo.radius + 'km'; 
    }
    return searchObject;  
  }
  /** 
   * Method formats a search query object from the input data of the front end.
   * Conditional formatting is applied for 'hashtag filtering' and 'geographical filtering' modes. 
   * Latitude and longitude values are obtained via a twitter API call, if geographical mode is selected. 
  */


  repeatCheck (text, array) {
    let repeat = false;
  
    //Iterate through array of tweets: 
    for (let tweet of array) {
      let tArray1, tArray2; 
      [tArray1, tArray2] = [tweet.text.split(' '), text.split(' ')]; 
  
      //Run iterative comparison of text elements in tweet text and input text if lengths of both match: 
      if (tArray1.length === tArray2.length) {
        let matchCount, x;
        [matchCount, x] = [0, 0];
        while (x < tArray1.length) {
          if (tArray1[x] === tArray2[x]) {
            //Add 1 for each matching array element in both text arrays: 
            matchCount ++  
          }
          x++ 
        }
        if (tArray1.length === matchCount) {
          //Break loop and return positive match if all array elements match: 
          return repeat = true
        }
      }
    }
    return repeat; 
  }
  /** 
   * Method removes any duplicate tweets that are present in the twitter API response object containing tweets. 
  */

  getCoordinates(location, coordinates) {
    return new Promise((resolve, reject) => {
          //Use twit module to make a GET request (via twit module) to twitter API, using location (and radius) data: 
          T.get('geo/search', {query: location, max_results: 1}, (err, data) => {
           if (err) {
               reject(err);
           } else {
              //Resolve promise with latitude and longitude data:
              coordinates.lat = data.result.places[0].centroid[1]; 
              coordinates.long = data.result.places[0].centroid[0]; 
              resolve(coordinates);
           }
        });
     });
  }
      /** 
       * Method makes a GET request, using provided location (location and radius) data, for geographical coordinates from the twitter API. 
       * The npm module is a promise enabled version of the twit package for easy asynchronous calls to the Twitter API. 
      */

  async process(res, signal = '') {
    const parameters = await this.searchParams;  
   
    //Make GET request call to Twitter APU for tweets: 
    T.get('search/tweets', parameters, (err, data) => {   
        //Iterate through the twitter response: 
        const dataResponse = data.statuses;
        let tweets = []; 

        for (let i = 0; i < dataResponse.length; i++) {
            //Extract twitter response information to appropriate variables: 
            let currentTweets, repeatSignal; 
            const tweetText = data.statuses[i].text;

             //Check for repeat Tweets: 
            if (i > 0) {
                currentTweets = dataResponse.slice(0, i); 
                repeatSignal = this.repeatCheck(tweetText, currentTweets);  
            }
           

            if (repeatSignal) {
                //Indicate repeated tweet: 
                console.log('repeat');    
            } else {
                //Collect tweet texts to proper container array: 
                tweets.push(tweetText)
            }
        }
      
        //Apply cleaning and vectorizing procedure to obtained tweets: 
        this.Preprocessor.cleanAndVectorize(tweets, signal).then(result => {

          //Send response back to front end with proper information for frontend processing
          if (result === 'done') {
            res.json({response: signal, tweetCount: tweets.length, code: 200}); 
          } 
          //Send error information back to frontend in case of error presence: 
          else {
            res.json({code: result.status, message: result.message}); 
          }
      }); 
    })
  }
        /** 
         * Method uses query search object to make a get request call to the twitter API and processes tweet informaion to numerical input vector form. 
         * The call is made and the tweet text information is resolved into a form appropriate for the tweet processing and vectorizing procedure. 
         * Cleaning is inherently done via the Cleaner object (integrated to the preprocessor class) and the vectorization is handled here too. 
         * The input vector itself is stored into the appropriate collection in the database.
         * JSON responses are sent depending on the result of the tweet processing and vectorization. 
        */
}

module.exports.DataPrepEngine = DataPrepEngine; 

/** DataPrepEngiine: 
 *  This class is a 'master control class' that handles initial data processing of frontend data, calls to the twitter API, and tweet processing/vectorizing. 
 *  The engine contains an integrated dataPreprocessor class instance that handles the 'dirty details' of tweet processing and vectorization. 
 *  This class contains higher level functionality that mediates half of the backend data processing, once the search form input values are sent in from the frontend. 
 *  See readME for more information on the purpose of WHY tweet processing is needed, which explores the importance of this class in the web app backend functionality.
 */

