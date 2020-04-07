import React, {Component} from 'react';
import '../../App.css';
import 'materialize-css/dist/css/materialize.min.css';
import ModeSelect from './ModeSelect'; 
import ModelInputs from './ModeInputs';



class GeoSelect extends Component {

    render() {
        const ref1 = this.props.ref1; 
        const ref2 = this.props.ref2; 
        const ref3 = this.props.ref3; 

        return (
            <div id="section1" ref={this.props.reference} >
                <ModeSelect 
                            toggle={this.props.toggle} 
                            addValue={this.props.addValue} 
                            ref1={ref1}
                            />
                <ModelInputs 
                            advance={this.props.advance} 
                            geoState={this.props.geoState} 
                            ref2={ref2}
                            ref3={ref3}
                            />
            </div>
        )
    }
}

/**
 * GeoSelect Component is a wrapper component that contains elements for the "Geographical Search" half of SearchForm. 
 * Component display is disabled upon clicking of the "Next" button within this component. 
 */

export default GeoSelect; 