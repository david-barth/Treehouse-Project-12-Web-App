import React from 'react'; 
import 'materialize-css/dist/css/materialize.min.css';


const Explanation = () => {
    return (
        <div className="col s12 m6">
            <div className="card blue darken-1">
            <div className="card-content white-text">
                <span className="card-title">Tweet Specifications:</span>
                <p>
                Now you specify the desired search subject of your tweet.  
                This is preferably a subject that is news worthy and related to "World News", "Science and Technology", "Business", "Football", or "Environment". 
                After, you may choose to further focus your search by adding in 2 desired words for Hashtag filtering. 
                This will allow you to search for tweets based on specific Hashtags. These are optional and you may proceed without this. 
                </p>
            </div>
            </div>
        </div>
    )
}; 

/**
 * Explanation component displays a minor explanation on how to conduct the second half of the SearchForm component, the "tweet subject"
 */

export default Explanation; 