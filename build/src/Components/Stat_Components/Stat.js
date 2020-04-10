import React, {Fragment, Component} from 'react';
import '../../App.css';
import 'materialize-css/dist/css/materialize.min.css';

//Component Imports: 
import StatExplanation from './StatExplanation'; 
import StatDisplay from './StatDisplay';
import StatButtons from './StatButtons';  



class Stat extends Component {
    render() {
        return (
            <Fragment>
                <div className="row">
                    <StatExplanation />
                    <StatDisplay stats={this.props.stats} />
                </div>
                <StatButtons componentChange={this.props.componentChange} getNews={this.props.getNews} /> 
            </Fragment>
        )
    }
}

/** 
 * Stat component acts as a wrapper for tweet statistics and news retrieval functionalities on the frontend. 
 * This component is updated to reflect the current number of searches and tweets present. 
 * Component purpose is to inform the user about whether or not neural network analysis and news retrieval should be attempted. 
 * This is done via a recommendation given in the component.
 * Functionality to do an 'augment' search, for better prediction accuracy is also contained here.   
*/

export default Stat; 


