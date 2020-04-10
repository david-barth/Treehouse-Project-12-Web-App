import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';


const LoadingBar = () => {
    return (
        <div id="Loading" className="progress">
            <div className="indeterminate"></div>
            <header>Loading...</header>
        </div>
    )
}

/**
 * Component contains a basic loading bar used for fetch requests to the backend. 
 * Loading bar is used to sync frontend behavior with backend processs. 
 */

export default LoadingBar; 