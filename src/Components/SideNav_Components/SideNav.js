import React, {Component} from 'react';
import {
    Switch,
    Route,
    NavLink
  } from "react-router-dom";
import M from 'materialize-css/dist/js/materialize.min.js'; 
import 'materialize-css/dist/css/materialize.min.css';

//Component Imports: 
import SideItem1 from './SideItem1';
import SideItem2 from './SideItem2';
import SideItem3 from './SideItem3';
import SideItem4 from './SideItem4'; 



class SideNav extends Component {

    constructor() {
        super();         
        this.sideNavRef = React.createRef(); 
    }

    componentDidMount() {
        const elems = this.sideNavRef.current; 
        const instances = M.Sidenav.init(elems);
    }
    /** 
     * Constructor ref used to initialize the sideNav funtionality on component mounting. 
    */

    render() {
        return (
            <div  id="side" className="row">
                <div className="col s3 blue lighten-4">
                    <ul id="slide-out" ref={this.sideNavRef}  className="sidenav blue lighten-4">
                        <li><NavLink className="waves-effect" to="/">Intro</NavLink></li>
                        <li><NavLink className="waves-effect" to="/MLPowered">Machine Learning Powered</NavLink></li>
                        <li><NavLink className="waves-effect" to="/underHood">What Happens?</NavLink></li>
                        <li><NavLink className="waves-effect" to="/interplay">An Interplay of Numbers and Words</NavLink></li>
                    </ul>
                    <a href="#" data-target="slide-out" className="sidenav-trigger"><p>Intro</p><i className="material-icons">menu</i></a>
                </div>

                <Switch>
                    <Route exact path="/" component={() => (<SideItem1 />)} />
                    <Route exact path="/MLPowered" component={() => (<SideItem2 />)} />
                    <Route exact path="/underHood" component={() => (<SideItem3 />)} />
                    <Route exact path="/interplay" component={() => (<SideItem4 />)}/>
                </Switch>
            </div>
        )
    }
}; 

/** 
 * The SideNav component contains the overview of the app, basic neural network theory, and explanation of the app processes. 
 * Component divides these explanations into 4 categories or sections. 
 * The sideNav component is only present in the 'Non-functional' rendering of the app and is accessed via the main Nav component. 
*/

export default SideNav; 