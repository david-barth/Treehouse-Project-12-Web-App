import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';


const SideItem4 = () => {
    return (
        <div className="col s12 m7 blue lighten-3">
            <h4 className="header">An interplay of numbers and words</h4>
            <div className="card horizontal blue lighten-1">
                <div className="card-image">
                <img src="https://www.havefunteaching.com/wp-content/uploads/2013/07/number-word-flash-cards.jpg" />
                </div>
                <div className="card-stacked">
                <div className="card-content">
                    <p>
                        A neural network cannot understand words directly.  
                        Instead, it relies on words to be converted to patterns of numbers in order to intepret word content and give a reliable prediction.  
                        This app does just that; batches of tweets are converted into numbers and these numbers are fed into the neural network for prediction results. 
                        The patterning of these numbers are recognized by the neural network as patterns associated with "world news", "science and technology", "business news", "soccer news", and "environmental news". 
                        The more numbered word patterns a neural network "knows", the more flexible and responsive the predictions it can give!
                    </p>
                </div>
                </div>
            </div>
        </div>
    )
}; 

/**
 * Component contains explanation of how the app neural network interprets input patterns. 
 */

export default SideItem4; 