import React from 'react';
import '../../App.css';
import 'materialize-css/dist/css/materialize.min.css';
 


const Article = (props) => {
    //Split date from time: 
    const timeAndDate = props.articleInfo.date.split('T'); 
    const date = timeAndDate[0]; 

    return (
        <div className="row" id={props.id}>
            <div className="col s6 offset-s3">
                <div className="card medium">
                    <div className="card-image">
                    <img src="https://materializecss.com/images/sample-1.jpg" />
                    <span className="card-title">Article {props.articleNum}: {props.articleInfo.title}</span>
                    </div>
                    <div className="card-content">
                    <p>
                        The selected category is {props.articleInfo.section} and the date of publication is {date}
                    </p>
                    </div>
                    <div className="card-action">
                    <a href={props.articleInfo.url}>News Article</a>
                    </div>
                </div>
            </div>
        </div>
    )
}; 

/**
 * Component progrmamatically holds the article title, category (section), date of publication and URL. 
 * Displayed in a card and linked to NewsDisplay. 
 */

export default Article; 