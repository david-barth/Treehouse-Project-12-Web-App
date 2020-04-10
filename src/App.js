//Main Module Imports
import React, { Fragment, Component } from 'react';
import {
  BrowserRouter,
  Switch, 
  Route
} from "react-router-dom";
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';

//Component Imports: 
import Nav from './Components/Nav';
import SideNav from './Components/SideNav_Components/SideNav'; 
import ErrorPart from './Components/ErrorPart'; 
import SearchForm from './Components/SearchForm_Components/SearchForm';
import LoadingBar from './Components/LoadingBar'
import Stat from './Components/Stat_Components/Stat';
import NewsDisplay from './Components/NewsDisplay_Components/NewsDisplay';  

//Key Variables: 
const initial = '/Backend_Interface/routes/index.js/tweetPost'
const augment = '/Backend_Interface/routes/index.js/tweetAugment'  
const newSearch = '/Backend_Interface/routes/index.js/newSearch'
const getNews = '/Backend_Interface/routes/index.js/getNews' 


//App Class Declaration: 
class App extends Component {
  constructor () {
    super(); 

    //States:
    this.state = {
      activeComponent : null,
      articleInfo: null,
      statusCode: 0,  
      message: '',
      tweetCount: 0, 
      tweetSearch: 0, 
    }

    //Refs for SearchForm input elements: 
    this.ref1 = React.createRef(); 
    this.ref2 = React.createRef(); 
    this.ref3 = React.createRef(); 
    this.ref4 = React.createRef(); 
    this.ref5 = React.createRef(); 
    this.ref6 = React.createRef(); 
    this.ref7 = React.createRef(); 
    this.ref8 = React.createRef();
   
    
    this.refCollection = [];
    
    //Method Bindings:
    this.componentChange = this.componentChange.bind(this); 
    this.submitHandler1 = this.submitHandler1.bind(this);  
    this.submitHandler2 = this.submitHandler2.bind(this);  
    this.formatNews = this.formatNews.bind(this); 
    this.getNews = this.getNews.bind(this);
    this.prepareStats = this.prepareStats.bind(this);
    this.newSearch = this.newSearch.bind(this); 
  }

  componentDidUpdate () {
    this.refCollection = [
      this.ref1.current, 
      this.ref2.current, 
      this.ref3.current, 
      this.ref4.current, 
      this.ref5.current, 
      this.ref6.current, 
      this.ref7.current, 
      this.ref8.current,  
      ];
  }
  /**
   * Lifecycle method helps define ref assignments to SearchForm inputs upon updating App level component. 
   */


  get initialState() {
    return {
      activeComponent: ''
    };
  }
  /**
   * Resets initial state of activeComponent. 
   * Acts as a precursor to setting the active component to the next approprriate component. 
   */


  prepareStats() {
    let rec; 

    //Conditional setting of tweet recommendation based on current total number of processed tweets: 
    if (this.state.tweetCount < 50) {
      rec = 'Redo search with augment!'; 
    } 
    else if (this.state.tweetCount >= 50) {
      rec = 'Click "Read"! There are enough tweets.'; 
    }

    //Organize relevant tweet statistics for use in Stat component.  
    let stats = {
      tweetCount: this.state.tweetCount, 
      tweetSearch: this.state.tweetSearch, 
      rec: rec,  
    }

    return stats; 
  }
  /** 
   * Method organizes and formats statistical information of tweets into a form that is easily accessed for the Stat component. 
   * State information based on current total of processed tweets and number of searches are integrated into this object. 
   * A programmatic recommendation for repeat 'augment' searches is made based on the current total of processed tweets.
  */

  

  async getNews(e) {
    const button = e.target.id; 
    
    if (button === 'ReadNews') {
        //Render Loading Bar:
        this.renderBar();

        //Fetch news articles from backend and format from json: 
        const response = await fetch(getNews); 
        const newsArticles = await response.json(); 
        
        if (newsArticles.code === 200) {
          //Format news response set to new object and set state and reset tweet statistics: 
            const formatted = this.formatNews(newsArticles.response); 
            await this.setState({ articleInfo: formatted, 
                                  activeComponent: '', 
                                  tweetCount: 0, 
                                  tweetSearch: 0
                                });
            

            //Render NewsDisplay:
            this.setState({activeComponent: button})    
        } 

        //Render ErrorPart component in case of backend error during news GET process: 
        else if (newsArticles.code === 500) {
          await this.setState({activeComponent: 'Error',
                                tweetSearch: 0})       
        }
        
    }
}
/** 
 * Method is invoked to make GET request for news articles from The Guardian API and JSON response is processed for display on NewsDisplay component. 
 * Tweet statistics information are reset during this time, in preparation for new searches or in case an error occurs. 
 * News article JSON information is handed off to NewsDisplay component as it is loaded. 
 * Error handling is also accounted for with basic 500 error handling. 
*/



formatNews(newsArticles) {
    let container = [];

    //Loop through newsArticles to format news information according to object format:  
    for (let article in newsArticles) {
        let articleInfo = {};
        let newsObject = newsArticles[article];  
        articleInfo.title = newsObject.webTitle; 
        articleInfo.section = newsObject.sectionName; 
        articleInfo.url = newsObject.webUrl; 
        articleInfo.date = newsObject.webPublicationDate; 
        container.push(articleInfo); 
    }

    return container
} 
/** 
 * Formats news article JSON response information into a proper form for furhter processing in the NewsDisplay component. 
 * A choice of 3 news articles for display is made for this app and thus an array of 3 article objects is given. 
*/

  async componentChange(e) {
    const active = e.target.id || e;
    await this.setState(this.initialState)
    this.setState((prevState) => ({
      activeComponent: prevState.activeComponent + active
    }))
  }
  /** 
   * An event handler that induces component transitions between specific parts of the component. 
   * This handler is chosen for use in specific buttons, but certain component transition points required specifically defined versions of this handler. 
   * This issue is a big limitation to the app in its current form as it violates DRY principles, which shall be addressed in a future iteration.
  */

  async renderBar() {
    await this.setState(this.initialState)
    this.setState((prevState) => ({
      activeComponent: prevState.activeComponent + 'Loading'
    }))
  }
  /** 
   * A variation of the componentChange handler used to render the component for the app loading bar. 
  */

  submitHandler1(e) {
    //Prevent Redirecting of page: 
    e.preventDefault(); 

    //Render loading bar until backend signal comes: 
    this.renderBar(); 

    //Collection of input Values: 
    const inputValues = this.assembleValues(this.refCollection) 

    //Sending to the backend: 
    this.sendValues(inputValues, initial); 
  }
  /** 
   * A submit handler responsible for assembling input values and submitting them to the backend. 
   * Input values are obtained from attached refs and formatted to an initial object for processing on app backend. 
   * Loading bar behavior is integrated. 
   * Comes in 2 variations: an initial search handler and an augment search handler. 
  */

  submitHandler2(e) {
    //Prevent Redirecting of page: 
    e.preventDefault(); 

    //Render loading bar until backend signal comes: 
    this.renderBar(); 

    //Collection of input Values: 
    const inputValues = this.assembleValues(this.refCollection) 

    //Sending to the backend: 
    this.sendValues(inputValues, augment); 
  }
  /** 
   * Same as above search handler notes, but with additional signal for an augment search to be conducted in the backend. 
  */


  async renderStat() {
    await this.setState(this.initialState); 
    this.setState((prevState) => ({
      activeComponent: prevState.activeComponent + 'Stat'
    })); 
  }
  /** 
   * Handler to render the Stat component after a tweet search is requested. 
  */

  assembleValues(refCollection) {
    const valueCollection = []; 
    
    //Loop through ref collection and extract values from input elements: 
    refCollection.forEach((ref) => {
      const value = ref.value; 

      if (ref.checked) {
        //Specifically extract checked value of the relevant radio button: 
        valueCollection.push(ref.checked)
      } else {
        valueCollection.push(value); 
      }
    })

    return valueCollection;
  }
  /** 
   * Extracts values from user input fields within the SearchForm component. 
   * Logic included for non-text input fields. 
  */


  async sendValues(inputValues, endpoint) {
    //Assemble array of input values to object format: 
    const postData = Object.assign({}, inputValues); 

    //POST request of input data to relevant backend endpoint
    const fetchRequest = await fetch(endpoint, 
      {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
    
    //Parse JSON response and update relevant tweet statistic states upon response: 
    const response = await fetchRequest.json();  
    
    if (response.tweetCount === undefined) {
      //Fix value of response tweet count to 0 if a bad response occurs from backend:
      response.tweetCount = 0; 
    }

    
    this.setState((prevState) => 
      ({tweetCount: prevState.tweetCount + response.tweetCount, 
        tweetSearch: prevState.tweetSearch + 1}));

    //Either render Stat or ErrorPart component depending on response code: 
    if(response.code === 200) {
      this.renderStat(); 

    } else {
      await this.setState({activeComponent: 'Error', message: response.message, statusCode: response.code})
    }
  }
  /** 
   * Main method for sending user data to conducting a tweet search and then processing the resulting response statistics. 
   * Method format and sends a user input object to backend via fetch API. 
   * The JSON response is parsed, processed, and relevant statistical information is updated for Stat component display. 
   * Error handling, with 500 error message, is integrated for basic error handling purposes. 
  */


  async newSearch() {
    //Make fetch request to appropriate backend route:  
    const fetchRequest = await fetch(newSearch); 

    //Either parse response and initialiaze tweet information or set rendering to ErrorPart component:  
    const response = await fetchRequest.json(); 
    if (response.code === 200) {
        await this.setState({tweetCount: 0, tweetSearch: 0});
    } else {
        await this.setState({activeComponent: 'Error', message: response.message, statusCode: response.code})
    }
  }
  /** 
   * Method is used to reset tweet statistic information on frontend and to delete input vector information on the backend. 
   * Acts as a 'reset' for the app, erasing any 'memory' of previous searches clustered on a particular set of topics. 
   * Triggered at the Nav component. 
  */



  render() {
    //Set activeComponent for conditional rendering: 
    const active = this.state.activeComponent;
    let activePart;
  
    //Conditionally render 'initial search' version of SearchForm: 
    if (active === "SearchForm" || active === "SearchFormError") {
      activePart = <Route exact to="/search" component={() => (<SearchForm
                                                                           submitHandler={this.submitHandler1}
                                                                           ref1={this.ref1} 
                                                                           ref2={this.ref2}
                                                                           ref3={this.ref3} 
                                                                           ref4={this.ref4} 
                                                                           ref5={this.ref5}
                                                                           ref6={this.ref6}
                                                                           ref7={this.ref7}
                                                                           ref8={this.ref8}
                                                                           />)}/>  
    }

    //Conditionally render 'augment search' version of SearchForm: 
    else if (active === "Augment" || active === "AugmentError") {
      activePart = <Route exact to="/search" component={() => (<SearchForm
                                                                          submitHandler={this.submitHandler2}
                                                                          ref1={this.ref1} 
                                                                          ref2={this.ref2}
                                                                          ref3={this.ref3} 
                                                                          ref4={this.ref4} 
                                                                          ref5={this.ref5}
                                                                          ref6={this.ref6}
                                                                          ref7={this.ref7}
                                                                          ref8={this.ref8}
                                                                          />)}/> 
    }

    //Conditionally render ErrorPart: 
    else if (active === 'Error') {
      activePart = <ErrorPart 
                              statusCode={this.state.statusCode} 
                              message={this.state.message} 
                              tweetSearch={this.state.tweetSearch}
                              tweetCount={this.state.tweetCount}
                              componentChange={this.componentChange}
                              /> 
    }

    //Conditionally render LoadingBar: 
    else if (active === 'Loading') {
      activePart = <LoadingBar />      
    }

    //Conditionally render Stat: 
    else if (active === "Stat") {
      activePart = <Route exact to="/stat" component={() => (<Stat 
                                                                  stats={this.prepareStats()} 
                                                                  getNews={this.getNews} 
                                                                  componentChange={this.componentChange} 
                                                                  />)}/> 
    }

    //Conditionally render NewsDisplay component from Nav or from Stat component: 
    else if (active === "NewsDisplay" || active === "ReadNews") {
      activePart = <Route exact to="/display" component={() => (<NewsDisplay articleInfo={this.state.articleInfo} />)}/>
    }

    //Conditionally render either 'explanation' version of App or 'analysis' version of app. 
    if (active === "Intro" || active === null || active === "Home" || active === 'nav') {
      //Render explanation version: 
      return (
        <BrowserRouter>
          <Fragment>
            <Nav newSearch={this.newSearch} componentChange={this.componentChange}/>
            <SideNav />
          </Fragment>    
        </BrowserRouter>
      )
    } else {
      //Render analysis version: 
      return (
        <BrowserRouter>
          <Fragment>
            <Nav newSearch={this.newSearch} componentChange={this.componentChange}/>
            <Switch>
              {activePart}          
            </Switch>
          </Fragment>    
        </BrowserRouter>
        )
    }
  }
}
/** App Rendering Explanation: 
 * App contains two different versions to it: the explanation version and the analysis version. 
 * Explanation Version ---> Contains sideNav component that explains overview of the app to the user, with no active component. 
 * Analysis Version ---> Contains all lower level components needed to facilitate app search and news processes.  No SideNav here. 
 * Analysis version is best thought of as containing all functionality based components of the app. 
 * Functionality based component include: SearchForm, Stat, NewsDisplay. 
 * Therefore, 2 levels of conditional rendering exist: a 'macro' level for both versions and a 'micro' level for functionality components. 
*/

export default App;

//Continuation:  

    //4. Ensure that the package.json file contains all the necessary dependencies. 

    //5. Host the web app on a hosting service. 