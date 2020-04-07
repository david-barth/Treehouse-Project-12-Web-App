import React from 'react';
import '../../App.css';
import 'materialize-css/dist/css/materialize.min.css';
 

const StatDisplay = (props) => {
    return (
        <div className="collection">
            <a href="#!" className="collection-item active">Relevant Tweet Statistics...</a>
            <a href="#!" className="collection-item">Individual Tweet Count:     {props.stats.tweetCount} </a>
            <a href="#!" className="collection-item">Tweet Search Count:     {props.stats.tweetSearch} </a>
            <a href="#!" className="collection-item">Data Augmentation:     {props.stats.rec} </a>
        </div>
    )
}

/** 
 * Component displays tweet statistics including: number of tweets processed so far (tweet count) and number of completed searches (tweet search). 
 * Tweet count statistic is used to make a recommendation on whether or not a news GET request should be made. 
 * Statistics information derived from stats object passed from App component. 
*/

export default StatDisplay; 