import React from 'react';
import {NavLink} from "react-router-dom";
import 'materialize-css/dist/css/materialize.min.css';

const ErrorPart = (props) => {

    let searchCount = props.tweetSearch

    //Reset search count to 0 in case of error in initial search (e.g. no tweets found): 
    if (props.tweetCount === 0) {
        searchCount = 1; 
    }

    //Render 'Initial Search' version of component in case of error: 
    if (searchCount === 1) {
        return (
            <div className="container">
                 <p>Error Code {props.statusCode}: &ensp; {props.message}</p>
                 <div className="row">
                    <div className="col s6 offset-s3">
                        <NavLink to="/search" id="SearchFormError" onClick={props.componentChange} className="waves-effect waves-light btn">Redo initial search</NavLink>
                    </div>
                </div>
            </div>
        )
    } 

    //Render 'Augment Search' version of component in case of error: 
    else if (searchCount > 1) {
        return (
            <div className="container">
                 <p>Error Code {props.statusCode}: &ensp; {props.message}</p>
                 <div className="row">
                    <div className="col s6 offset-s3">
                        <NavLink to="/search" id="AugmentError" onClick={props.componentChange} className="waves-effect waves-light btn">Perform another augment search</NavLink>
                    </div>
                </div>
            </div>
        )
    }

    //Render 'Get News' version of component in case of error during news GET request: 
    else {
        return (
        <div className="container">
            <p>Error Code 500: News retrieval failed.  Please click 'Start a new search!' to begin a new search</p>
        </div>
        )
    }
}

/** 
 * ErrorPart component contains error handling elements for different situations in the web app process. 
 * Three error situations are covered: initial search errors, augment search errors, and news GET errors. 
 * Initial search errors occur only in the first tweet search and after augment search errors will occur. 
 * Only very basic error handling, with advice is given.  More advanced and user responsive error handling will be implemented in the future.
*/

export default ErrorPart;