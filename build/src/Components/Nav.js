import React from 'react';
import {NavLink} from "react-router-dom";
import 'materialize-css/dist/css/materialize.min.css';


const Nav = (props) => {
    return (
        <nav>
            <div className="nav-wrapper" id="nav" onClick={props.componentChange}>
                <NavLink to="/" id="Home" className="brand-logo">Tweet News Recommender</NavLink>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink id="Intro" to="/">About this app...</NavLink></li>
                    <li><NavLink id="SearchForm" to="/search" onClick={props.newSearch}>Start a new search!</NavLink></li>
                    <li><NavLink id="Stat" to="/stats">Tweet Statistics</NavLink></li>
                    <li><NavLink id="NewsDisplay" to="/display">Read your news</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

/** 
 * Nav component contains all the main routing for the SideNav, SearchForm, Stat, and NewsDisplay components. 
 * 'Start a new search!' will trigger a complete wip of all current tweet statistics and of the current input vector in the database. 
*/

export default Nav; 