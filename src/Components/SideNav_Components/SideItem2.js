import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';


const SideItem2 = () => {
    return (
        <div className="col s12 m7 blue lighten-3">
            <h4 className="header">Machine Learning Powered</h4>
            <div className="card horizontal blue lighten-1">
                <div className="card-image">
                <img src="https://databricks.com/wp-content/uploads/2019/02/neural1.jpg" />
                </div>
                <div className="card-stacked">
                <div className="card-content">
                    <p>This app is powered by a machine learning algorithm called a "Neural Network". 
                    Modeled off of human neurons, neural networks take in batches of inputs through the "input layer". 
                    This input data is modified through calculations carried out into 1 or more "hidden layers". 
                    The data is then sent out in its final form as a prediction through the "output layer". 
                    The prediction can be used either to guess a number or to generate a categorization for something. 
                    In this app, the input data are batches of tweets and the output is a prediction for a category of news article. 
                    </p>
                </div>
                </div>
            </div>
        </div>
    )
}; 

/**
 * Component contains elements hosting explanation for basic neural network theory.  
 */

export default SideItem2; 