import React from 'react';
import {NavLink} from "react-router-dom";
import '../../App.css';
import 'materialize-css/dist/css/materialize.min.css';
 

const StatButtons = (props) => {
    return (
        <div className="row">
          <div className="col s1 offset-s4">
            <NavLink id="Augment" onClick={props.componentChange} className="waves-effect waves-light btn-large" to="/search">Augment</NavLink>
          </div>
          <div className="col s1 offset-s1">
            <NavLink id="ReadNews" onClick={props.getNews} className="waves-effect waves-light btn-large" to="/display">Read your news</NavLink>
          </div>
        </div>
    )
}; 

/** 
 * Component contains buttons to allow news analysis and GET functionality as well as augment search functionality. 
 * Augment search allows for a search for tweets of a subject related to the previous search subject. 
*/

export default StatButtons; 