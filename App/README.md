# Project-12-Tweet News Recommender

This README file is intended to provide additional instructions, overview, and explanations for this project.  

//Introduction: 
  This project is a web app that uses a machine learning algorithm, called a "Neural Network", to analyze tweets and provide a recommendation
for a news category that most likely matches patterns of words found in the collected tweets.  The web app is connected to the Twitter API and 
The Guardian News API, which both provide the data needed for this functionality.  The project frontend is powered by the React library and the 
backend is powered by MongoDB and Node Express.  The neural network (NN) of this app is created using a library called TensorFlowJS (TFJS), created by google and modeled after the popular TensorFlow library and Keras API, both used primarily in Python.  TFJS is a Javascript implementation of the aforementioned libraries. 

In this readme, I will briefly explain some important points regarding the following: 

  1. The 'Flow' of Programming in this App
  2. App Use Suggestions



1. The 'Flow' of Programming in this App

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



2. App Use Suggestions


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