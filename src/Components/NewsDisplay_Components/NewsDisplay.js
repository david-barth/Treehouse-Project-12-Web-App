import React, {Fragment, Component} from 'react';
import {NavLink} from "react-router-dom";
import '../../App.css';
import 'materialize-css/dist/css/materialize.min.css';

//Component Imports: 
import Article from './Article'; 


class NewsDisplay extends Component {

    constructor() {
        super(); 

        //States: 
        this.state = {
            selectedArticle: 1 
        }

        //Other Properties
        this.articleCount = [1, 2, 3];
        
        //Function Bindings: 
        this.selectArticle = this.selectArticle.bind(this); 
    }


    async selectArticle(e) {
        const selected = e.target.id; 
        await this.setState({selectedArticle: selected}); 
    }
    /**
     * Handler responsible for changing the article that is displayed in this component, based on the id of the selected Navlink. 
     */


    render() {

        //Render reduced component if NewsDisplay component is loaded before news GET request is completed: 
        if (this.props.articleInfo === null) {
            return (
                <Fragment>
                    <div className="row">
                        <header>No News Loaded! Please do a tweet search in "Tweet Selection" and an analysis in "Tweet Statistics"</header>
                    </div>
                </Fragment>
            )
        }
        
        //Render full NewsDisplay component: 
        else if (this.props.articleInfo) {
            //Use selected NavLink id to assign proper information to Article component: 
            const selectionNumber = this.state.selectedArticle;
            const articles = this.articleCount.map(recNum => {
                const recString = recNum.toString();  
                return <Article id={recString} articleNum={selectionNumber} articleInfo={this.props.articleInfo[selectionNumber - 1]}/>
            });  
            let activeArticle = articles[selectionNumber - 1];

            //Render chosen Article component: 
            return (
                <Fragment>
                    <div className="row">
                        <ul className="pagination center bottom">
                            <li className="waves-effect" ><NavLink  onClick={this.selectArticle} exact to="/1" id="1" className="waves-effect">1</NavLink></li>
                            <li className="waves-effect" ><NavLink  onClick={this.selectArticle} exact to="/2" id="2" className="waves-effect">2</NavLink></li>
                            <li className="waves-effect" ><NavLink  onClick={this.selectArticle} exact to="/3" id="3" className="waves-effect">3</NavLink></li>
                        </ul>
                        {activeArticle}
                    </div>
                </Fragment>
            )
        }
    }
}

/**
 * NewsDisplay component diplsays processed information from the News GET request, via Article components. 
 * State is used to control which information, from the articleInfo prop is attached to the Article component. 
 * Component conditionally renders 2 different versions depending on if a news GET request was made previously or not. 
 */


export default NewsDisplay; 