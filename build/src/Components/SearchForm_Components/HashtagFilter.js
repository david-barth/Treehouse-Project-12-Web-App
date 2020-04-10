import React, {Component} from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import SearchSelect from './SearchSelect'; 
import HashInputs from './HashInputs'; 

class HashtagFilter extends Component {

    render() {
        const ref4 = this.props.ref4; 
        const ref5 = this.props.ref5; 
        const ref6 = this.props.ref6; 
        const ref7 = this.props.ref7; 
        const ref8 = this.props.ref8;

        return (
            <div id="section2" ref={this.props.reference}>
                <SearchSelect 
                                radioChoice={this.props.radioChoice} 
                                buttonState={this.props.buttonState}
                                toggle={this.props.toggle}
                                addValue={this.props.addValue}
                                ref4={ref4}
                                ref5={ref5}
                                ref6={ref6}
                                /> 
                <HashInputs 
                                hashState={this.props.hashState}
                                addValue={this.props.addValue}
                                ref7={ref7}
                                ref8={ref8}
                                />
                <div className="row">
                    <div className="col s6 offset-s5">
                        <button id="send" className="btn-large waves-effect waves-light" type="submit" name="action">Get my Tweets!
                        <i className="material-icons right">send</i>
                        </button>
                    </div>              
                </div>  
            </div>
        );     
    }
}; 

/**
 * HashtagFilter component acts as a wrapper component for 'tweet subhect' and 'hashtag' inputs.  
 * Also contains submit button for form submission, for use with 'initial' and 'augment' searches, using submit handlders from the App component.
 */

export default HashtagFilter; 