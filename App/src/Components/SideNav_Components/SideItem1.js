import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';


const SideItem1 = () => {
    return (
        <div className="col s9">
            <div className="col s12 blue lighten-3">
                <div className="card horizontal blue lighten-1">
                    <div className="card-image">
                    <img src="https://techinsight.com.vn/wp-content/uploads/2019/08/Untitled-1-17.jpg" />
                    </div>
                    <div className="card-stacked">
                    <div className="card-content">
                        <p>Machine learning is more important than ever before, especially in web apps!
                            Web apps powered by machine learning can predict, learn, and understand our online behaviors.
                            Why is this important?  Because, these more advanced web apps can serve content customized to our tastes and preferences. 
                            Imagine being able to read news articles or get movie suggestions based on your tweets?
                            Or even better! Imagine having friends suggested to you based on your writing style or how you play a game?
                            Machine learning let's ALL of this happen. Many of these ideas are already used by Amazon, google, and more to transform your online browser experience. 
                            Now, even in smaller scale web apps, the power of these algorithms can be used in creative and amazing ways. 
                            This is such a web app...
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Component used to host elements containing overview of the web app. 
 * Included in SideNav.  
 * Main limitation: Can be reduced to a more reusable form in future iterations of the web app. 
 */

export default SideItem1; 