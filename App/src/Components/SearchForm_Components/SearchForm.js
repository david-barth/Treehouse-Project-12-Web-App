import React, {Component} from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import GeoSelect from './GeoSelect'; 
import HashtagFilter from './HashtagFilter'; 


class SearchForm extends Component {
    
    constructor() {
        super();

        //Refs: 
        this.geoRef = React.createRef(); 
        this.hashRef = React.createRef(); 


        //State Designations: 
        this.state = {
            geoState: null, 
            hashState: null, 
            radioState: 'option1',
            formPart: null,   
        };

        //Function Bindings: 
        this.initialize = this.initialize.bind(this);
        this.advanceForm = this.advanceForm.bind(this); 
        this.geoSelection = this.geoSelection.bind(this);
        this.hashSelection = this.hashSelection.bind(this); 
        this.radioChoice = this.radioChoice.bind(this);
        this.validationCheck = this.validationCheck.bind(this); 
    }

    initialize () {
        this.setState({ 
            geoState: false,
            hashState: false, 
            formPart: 1
        }); 
    }
    /**
     * Initialize SearchForm states for geographical inputs, hashtag inputs, and form advvancement. 
     * formPart state indicates which half of the SearcForm component is displayed currently. 
     */
    

    componentDidMount() {
        this.initialize();
    }

    /**
     * SearchForm states are initialized upon component mounting. 
     */

    componentDidUpdate() {
       const geoNode = this.geoRef.current; 
       const hashNode = this.hashRef.current;

       //Initialize displays of SearchForm subc-components
       hashNode.style.display = 'none'
       
       //Alter displays of sub-components to advance to next half of the SearchForm component: 
       if (this.state.formPart === 2) {
            geoNode.style.display = 'none'; 
            hashNode.style.display = 'block'; 
       }
    }
    /**
     * formPart state examined to determine which half (geographical or hashtag) of SearchForm to display on component update. 
     */

    advanceForm () {
        //Apply alert() based validation constraints on Geographical Mode form elements: 
        const signal = this.validationCheck(); 
        
        //Either update formPart state if validationCheck is passed or send alert with validation information: 
        if (signal === 'Pass') {
            this.setState({formPart: 2});
        } else {
            alert(signal); 
        }
    }
    /** 
     * Method advances the SearchForm element from the 'Geographical' half to 'Hashtag/Tweet Subject' half upon validation passing. 
     * formPart state of 1 is tied to Geographical half and a state value of 2 is the tweet subject half. 
     * Customized valuidation schemes provided for this part, based on programmatic alert(). 
     * Method handdler is tied to the "Next" button. 
    */


    validationCheck() {
        let inputs = [
            this.props.ref1.current, 
            this.props.ref2.current,
            this.props.ref3.current 
        ]; 

        //Make check for global selection in mode select menu: 
        if (inputs[0].value === 'global') {
            return 'Pass'; 
        }

        //Set up initial message: 
        let initial = 'Please fill out or select the following fields:\n'; 
        let message = initial; 

        //Make check for empty inputs: 
        for (let i in inputs) {
           if (inputs[i].value === '' || inputs[i].value === 'DEFAULT' || inputs[i].disabled === true) {
               message += `Field: ${inputs[i].id}\n`
           } 
        }

        if (message !== initial) {
            return message
        }

        //Check for numbers in radius input: 
        const regexNum = /^\d+(\\.\d+)?$/; 
        if (inputs[1].value.search(regexNum) === 0) {
            message = 'Location field: Please enter a location using letters only.'; 
            return message; 
        }
       
        //Check for numbers in radius input: 
        if (inputs[2].value.search(regexNum) === -1) {
            message = 'Radius Field: Please enter a numerical value';
            return message;  
        }
        
        return 'Pass';  
    }
    /** 
     * Method defines and uses validation constraints for 'Mode Select', 'Location', and 'Radius' inputs/elements. 
     * Constraints include: checks for empty input values, letter values for Location, and numerical values for Radius. 
     * Nethod sends a 'Pass' signal if validation constraints are met or if 'Global' mode is selected in 'Mode Select'.
     * Otherwise, a validation error message is returned with information on which validation constraints failed.  
    */

    async geoSelection(e) {
        const selection = e.target.value;
        
        //Toggle geoState based on which Mode Select option is selected: 
        if (selection === 'global') {
            await this.setState({geoState: true}); 
        } 
        else if (selection === 'geographical') {
            await this.setState({geoState: false}); 
        }
    } 
    /** 
     * Handler sets the geostate state to true or false based on select menu choice. 
     * This state is used to enable or disable the 'Location' and 'Radius' inputs needed for a geographical search for tweets. 
     * Hanlder is tied to the select menu in 'ModeSelect' component. 
    */

    

    hashSelection() {
        //Toggle hashState based on chosen option from radio button and the inverse of previous hashState: 
        if (this.state.radioState === 'option1' && !this.state.hashState) {
            this.setState((prevState) => ({
                hashState: !prevState.hashState  
            })); 
        } 
        else if (this.state.radioState === 'option2' && this.state.hashState) {
            this.setState((prevState) => ({
                hashState: !prevState.hashState  
            })); 
        }
    }
    /** 
     * Method enables or disables the hashtag inputs based on prior radio button selection.  
     * Additional logic, based on prior hashState, is used to reinforce a binary behavior in input enabling/disabling based on radio button choice.
     * Tied to the SearchSelect component. 
    */

    radioChoice(e) {
        this.setState({
            radioState: e.target.value
        });        
    }
    /** 
     * Handler sets radiosState value based on user selection of radio buttons. 
     * This state and hanlder 'reocrds' user choice on radio buttons in order to enable or disable hashtag input elements. 
     * Acts as the first step in the above 'hashSelection' handler. 
    */


    render() {
        const geoState = this.state.geoState; 
        const hashState = this.state.hashState; 

        const ref1 = this.props.ref1; 
        const ref2 = this.props.ref2; 
        const ref3 = this.props.ref3; 
        const ref4 = this.props.ref4; 
        const ref5 = this.props.ref5; 
        const ref6 = this.props.ref6; 
        const ref7 = this.props.ref7; 
        const ref8 = this.props.ref8; 


        return (
            <div className="row">
                <form className="col s12" onSubmit={this.props.submitHandler}>
                        <GeoSelect 
                            toggle={this.geoSelection} 
                            geoState={geoState} 
                            advance={this.advanceForm}
                            reference={this.geoRef}
                            ref1={ref1}
                            ref2={ref2}
                            ref3={ref3}
                        />
                        <HashtagFilter 
                            radioChoice={this.radioChoice} 
                            buttonState={this.state.radioState}
                            hashState={hashState}
                            toggle={this.hashSelection}
                            reference={this.hashRef}  
                            ref4={ref4}
                            ref5={ref5}
                            ref6={ref6}
                            ref7={ref7}
                            ref8={ref8}
                        />;  
                </form>
            </div>
        )
    }
}

/** 
 * SearchForm component contains all functionalities and elements needed to specify user's tweet search specifications. 
 * The component is divided into 2 halfs: a 'Geographical' half and a 'Tweet Subject/Hashtag' half. 
 * Geographical half: User selects if they want to commence with geographical mode search, which filters tweet search for tweets based on location within a certain radius. 
 * Tweet Subject half: User selects if they wish to narrow the search based on including hashtag operators in the tweet search.  
 * If hashtag filtering is omitted, then primary tweet subject is specified here. 
 * State is used to enable / disable certain inputs related to these search features. 
 * Form sub-components are displayed once at a time, controlled via state.
 * Therefore, HTML 5 validation is only used for one half of the form while custom alert() validation is used for another half.
*/

export default SearchForm; 