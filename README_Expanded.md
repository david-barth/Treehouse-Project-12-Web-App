# Project-12-Tweet News Recommender

This README file is intended to provide additional instructions, overview, and explanations for this project.  

//Introduction: 
  This project is a web app that uses a machine learning algorithm, called a "Neural Network", to analyze tweets and provide a recommendation
for a news category that most likely matches patterns of words found in the collected tweets.  The web app is connected to the Twitter API and 
The Guardian News API, which both provide the data needed for this functionality.  The project frontend is powered by the React library and the 
backend is powered by MongoDB and Node Express.  The neural network (NN) of this app is created using a library called TensorFlowJS (TFJS), created by google and modeled after the popular TensorFlow library and Keras API, both used primarily in Python.  TFJS is a Javascript implementation of the aforementioned libraries.

In this readme, I will briefly explain some important points regarding the following: 

  1. TFJS, NNs and Natural Langauge Analysis (NLP)
  2. The Training Process for this NN and Selected Techniques
  3. The 'Flow' of Programming in this App
  4. App Use Suggestions
  5. Limitations and Future Iterations
  
  
//1. TFJS, NNs and Natural Language Processing: 
  
  A.  TFJS: Javascript implementations of machine learning are scarce.  TensorFlow JS is the most systematic and extensive library as of now. 
            TFJS contains 2 APIs, a lower level 'Ops' API and a higher level "layers' API.  In this project, the Ops API is used to prepare and
            manipulate vectorized input data for use in a neural network.  The main object used for inputs into neural networks in TFJS are tensors.  Tensors can be thought of as multi-dimensional arrays for specific use in TFJS and tensors are the only form of input a
            neural network will accept in TFJS.  The layers API is used to construct neural networks in fast and efficient way, without worrying about complex details for implementation.  Parameters and details of the neural network are easily set using the layers AP   

    B. NN: Neural networks are machine learning algorithms used for many different forms of prediction.  NNs consist of 'layers' of computing 
           nodes called 'neurons'.  There is an 'input layer' that accepts input tensor (vector) values, at least 1 'hidden' layer for further 
           calculation, and an 'output' layer for obtaining prediction results.  NNs ONLY work with number value inputs, usually scaling from 0 to 1.  The input is transferred through the layers, with calculations done on each input value at each neuron, until a prediction is produced.  Like most machine learning algorithms in use, a 'training phase' must be used with the NN with a set of 'training data'.  The training phase involves producing output values being compared to a set of 'testing data' in which the answers/outputs are already known.  The end result of the training phase is a NN, with neurons that are trained for a 'specific question' or situation. In this app, this situation involves analyzing words. 

    
    C. NLP: Natural language Processing is the study of patterns in words and phrases by machine learning algorithms.  Machine learning is used         recognize linguistic and semantic patterns in word samples for many uses.  This app focuses on applying a neural network to the NLP         problem of classifying different word patterns in tweets with different news categories.  NLP training phases for NNs has the added 
            challenge of converting words to numbers for processing.  It is common for NLP applications to use a 'dictionary' of words in order to help in the conversion of word samples for numbers.  The dictionary is simply a collection of words recognized by the algorithm used in the app and this can be subject specific.  The precise use of the dictionary can vary depending on the technique used in the vectorization of the word samples.  



//2.  The Training Process for this NN and Selected Techniques: 

    Training Process: Training involved several key stages:

        A. 'Building' a dictionary of subject specific words.  

            ---> The dictionary was built using a web scraping file to GET tweets from the twitter API.  The tweets were all processed and cleaned of 'noise', leaving behind normal words.  These words were counted and compiled into a 'word map' object that kept track of the number of times the word occurred during dictionary building. Once enough tweets had been downloaded and processed (circa 1 week), the word map was arranged in descending order.  The top 2000 words in this order were 'cut' to form a separate word map, which is the dictionary used in this app.  The cut word map has its values reset to 0, but with the word order maintained.  This is used as a 'blank slate' to count words for individual tweet searches, in order to build an input vector.  


        B. Using a 'scraping' tool to gather tweets and prepare them for the training process. 
           
           ---> The same scraping tool file is used to gather and process tweets into input vectors for the NN training.  This stage involved   searching for real tweet subjects using topics related to the categories of this app.  The tweets were downloaded in bundles of      (max 100 per topic) and converted to input vectors (1 for each topic).  This process repeated until 800 input vectors were gathered and stored into a database for use in training and testing. 


        C. Undergoing the training process.      

           ---> The training process itself involved splitting the 800 input vectors into 700 training vectors and 100 testing vectors.  The testing vectors already had category labels assigned to them, while the training vectors were unlabled.  Training rounds are completed in cycles.  The first part of a cycle involves feeding the 700 training vectors into the NN and then feeding the 100 testing vectors into the NN.  The algorithm produces a prediction that is compared to the actual label of the testing vector.  An accuracy percentage is produced showing what percentage of labels were predicted currently per cycle.  This process repeats for a predetermined number of cycles, until training is complete.  

        
        Stage C takes place in TFJS code and many training rounds were required to get the accuracy percentage to desired levels.  This required consistent adjustment to different aspects of the NN and to the number of training cycles used per session.  Once a desired percentage is achieved, a NN 'weights' file is produced and used to load the trained NN parameters into another application.  The trainng process takes advantage of two main selected techniques in order to improve the quality of the training process and the input vectors.  


    Selected techniques for NLP:

        A. Word Preprocessing: Ideal results for NNs and other machine learning algorithms are obtained when a certain amount of preprocessing is used before vectorizing the word samples.  For example, the text "hey :) what's up bro!111" produces less quality data than the text "hey what is up brother".  Text elements like emojis, abbreviations, contractions, and numbers produce 'dirty data' or noise that decreases the accuracy of the NN.  Preprocessing involves removing these impure text elements from the text sample, leaving behind just the pure words in processed sample.  Different levels of preprocessing exist, but there are many limitations in javascript compared to python.  The Cleaner class is used in this app to provide proper preprocessing for the training phase and for the app itself.  


        B. Data Augmentation: Training the NN forces the NN to recognize certain patterns in words.  However, a small sample of training vectors can negatively affect the NN training process.  Data augmentation is a method used to counteract this and is represented in the following example.  If the goal of the sample is to recognize combinations of the letters YHW and the sample size has only YHW, HYW, and WHY, then the NN will be poorly trained.  The data can be augmented with a least 6 more combinations of YHW and repeat data can even be used, with repeats of YHW, HYW, and WHY datapoints.  These will force the NN to train and recognize a far wider set of YHW combinations.  The app also uses data augmentation, but in a different way.  The app may collect 49 tweets that produce an input vector with a lot of 0s.  The data can be augmented by conducting another search for more tweets, which updates the input vector.  This will produce an input vector with less 0s.  The result is an easier prediction for the NN to make. 


    The Technique of Vectorization: Vectorization is a complicated topic in NLP.  There are many different ways to convert words to numbers, each with different levels of complexity. This app chooses to use a vectorization technique called "Bag-of-Words" or BoW.  This technique literally involves counting the number of times a certain dictionary word appears in a text sample, so it is based on word frequency.  The example below will demonstrate more clearly:

    dictionary (wordmap) = {word1: 0, word2: 0, word3: 0}  and sample = ['word1', 'word1', 'word2', 'word3']

    ---> Counting gives:  dictionary = {word1: 2, word2: 1, word3: 1} 

    ---> Converting to a vector gives:  vector = [2, 1, 1]


    This example represents this app's implementation of the BoW technique by using a 'dictionary' or word map to count words that appear in a sample of word tokens, produced after preprocessing.  The app counts the word instances that match the dictionary word properties and increments the appropriate value by the number of times the word appears in the sample.  The word map is then converted into an array, for further processing using tensor operations in TFJS.  If a word4 exists, but is not in the dictionary, then the word4 is not counted in the vectorization scheme.  Dictionary sizes are limited due to computational expenses.  



//3. The 'Flow' of Programming in this App

The app's programming is meant to follow a very strict linear series of stages, between the frontend and the backend.  The 'flow' of programming can be represented in the following steps: 


    1. 'Start a new Search!' involves loading the SearchForm for specifying user tweet search preferences.  

    2. Form submission sends response to the appropriate backend route. 

    3. Backend route makes a GET request for tweets from the Twitter API, based on search preferences.  

    4. The backend route then uses preprocessing to clean the tweets and finally vectorizing the tweets. 

    5. The route stores the tweets into a mongoDB collection and sends a response back to the frontend. 

    6. The frontend extracts relevant tweet statistics to the Stat component and displays them. 

    7. Based on statistics, a recommendation is given for data augmentation or a news GET request. 

    8. If news GET is chosen, then a new request is sent to another backend route. 

    9. This backend route feeds formatted data to the NN engine to get a news category prediction. 

    10. The prediction is processed and a GET request is made to The Guardian API, based on the prediction. 

    11. The news article information is formatted and sent back to the front end to be displayed. 

    12. The frontend takes 3 articles and displays relevant information on the NewsDisplay component. 


This sequence only takes into if the user decides to follow through with the GET request for news right away.  If an augment search is chosen then the following sequence of events is made (starting from step 4): 

    1. An augment search request is sent, with a signal to a modified backend route for augment searches. 

    2. The same GET tweets request and cleaning + vectorizing processes are made. 

    3. The previously stored input vector elements are combined with the newly created input vector.  

    4. The combined vector is stored back into the database.   

    5. The normal statistics and GET news processes follow (as above in the primary sequence of events). 


At any point in the app's operation, if the Nav component option "Start a new seach!" is chosen, the app will make a call to a different backend route. This route will delete the input vector that is stored inside of the app's database.  Then, on the frontend, all tweet statistics shall be initialized.  This puts the entire app into a state for a completely different search subject, which assumes the user has chosen another line of inquiry.  



//4. App Use Suggestions


  Recommendations are made for how the app is intended for use.  While it should be evident how the app should be used, the UI and UX for this
app was made only to accommodate the previous programming flows that were detailed.  This section addresses the flow of events the user should use in order to properly use the app.  Enough error handling is integrated into the app to address deviations to these suggestions.  The following is the suggested series of user choices that the is suggested: 


    1. SideNav: 
    
            A. The landing page has the SideNav component rendered, shaded in light blue.  
            
            B. Clicking this sideNav will allow the user to view 4 sections that contain an overview of the app.    
            
            C. For users who do not read this README file, it is suggested to start with this SideNav content.  
            
            D. Clicking 'Tweet News Recommender' or 'Intro' will render the SideNav component. 

    
    2. SearchForm: 
    
            A. Clicking 'Start a new search!' renders the SearchForm component.  
            
            B. The first half on display is the Geographical search half, containing 'Radius' and 'Location' inputs.
            These restrict the tweet search geographically. 
            
            C. Clicking on 'Next' renders, the Hashtag search half of the form.  
            
            D. This allows for hashtags operators to restrict the tweet search.  
            
            E. It is suggested to commence with a 'Global' search and to use a 'General Search'. 
            
            F. These are options on the select menus and radio buttons in each half of the form.  
            
            G. These will disable the geographical and hashtag inputs and maximize the number of tweets that will be found.  


    3. Stats: 
    
            A. Clicking 'GET MY TWEETS!' will initiate the search for tweets and produce an input vector.  
            
            B. The recommendation is made to advance to the news retrieval process with 50 or more tweets.  
            
            C. This is ideal for neural network prediction accuracy, but thanks to the training process,the prediction can be accurate under 50 tweets.  
            
            D. The choice for an augment search is truly left with the user, and news can still be retrieved by clicking 'Read'.  
            
            E. Otherwise, 'Augment' can be clicked for a search with a related tweet subject term. 

    
    4. NewsDiplsay: 
    
            A. The NewsDisplay component will show 3 news articles that were obtained during the backend processes.  
            
            B. The title, the date of publication,   and the URL to the actual news article is given in the component.  
            
            C. Clicking on 1-3 will render a different news article among the 3 that were returned in the process.  

    
    5. A new search can be started by clicking 'Start a new search! or the user can read the obtained news articles. 


  Error handling is programmed into 3 parts of the app: the initial search, the augment search, and the news GET request.  Each of these 3 errors will provide a code 500 message with different suggestions: 


    1. Initial Search: 
            
            A. The error here will suggest to the user to click the button to "Redo Initial Search".  
            
            B. This will render the initial search version of SearchForm (tweet search = 0).   

    
    2. Augment Search: 
    
            A. The error here will suggest the user to click the button 'Perform another augment search', 
            
            B. This will render the augment search version of SearchForm (tweet search > 0). 


    3. News GET: 
    
            A. The error here will recommend the user to click 'Start a new Search!' from the Nav component.  
            
            B. It is already too late into the app process to reverse the searches made.  
            
            C. This is because the input vector was already deleted from the database. 

    

//5. Limitations and Future Iterations

I made this current iteration of the app to be a working version, relatively free of errors and to have self contained functionality that would not break down.  However, there are still issues with the design of the app user experience, the NN training process, and at the level of source code that makes this an imperfect version.  I will explore the limitations and challenges that I may try to address during refactorings of different sections of this app in future iterations of it.  All in all, I am extremely happy with having been able to weave machine learning into this project.  The limitations are: 

    1. Redundant sections of code:  This is especially true on the frontend React powered portion of the project.  This issue mainly applies       towards the various 'componentChange' state setting methods at the App component.  I am aware that the several variations of these would    best be addressed using DRY principles and I will attempt to do this in the future.  However, at the point I started writing these          various functions, I was already too far into the development process to write a general method, otherwise too much code would have been    undone and I am working on a time constraint for myself here. 


    2. NN training and scope: This neural network was trained to classify input vectors of tweets based on 5 categories of news (specified in      app).  The Guardian API, however, only returns a set number of news articles per 24 hours.  Consequently, if the label 'Football' is 
       predicted twice, the same exact set of articles will be returned from the API, even though the tweets are different.  A solution to this is to train the API to handle more than 5 categories of news in the future, so that more variation in articles can be obtained.  This however would require a more time consuming and resource demanding training phase.  Thus, this is potential left to future expansions of the app. 


    3. App UI and UX: This issue is relatively minor, but there are some issues relating to the interface and app experience.  This issue          includes being able to click on sections of the Nav out of order with the programming flow intended for the app.  For example, clicking 
       'Tweet Statistics' before starting a search leads to the Stat component without tweet statistics.  Clicking on 'Augment' would render the augment version of the SearchForm component, which would lead to error as this requires an input vector to be in the database.  In this case, there is none.  However, current error handling does provide a button ('Redo initial search') that will load the correct version of the SearchForm.  This is not a debilitating issue, but rather a source of improvement in the future. 


    4. Error Handling: This app includes a very basic error handling that only produces preprogrammed 500 errors from the backend.  As a 'proof    of concept' project, this level of error handling is sufficient.  It handles all major points of weakness in the app's programming.         However, for a proper product, a more refined error handling system, with more user friendly error advice and more responsive error code    integration, is required.  This could be a source of improvement for future iterations of the project. 


  These do not represent the total list of issues or weaknesses of the app.  There are more, but I feel like these are the most significant areas of improvement to be made.  In the end, this app was only ever a 'proof of concept' project that demonstrates how aggregated social media can be used to directly recommend content to a user.  This is made possible thanks to machine learning algorithms, and a recommendation system like this is already in heavy use for big data analytics.  This project was my scaled down attempt to capture this functionality.  


THANKS FOR READING!
David