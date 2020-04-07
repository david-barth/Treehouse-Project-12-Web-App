import React, {Component} from 'react';
import '../../App.css';
import M from 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css';



class ModeSelect extends Component {

    componentDidMount() {
        const select = this.props.ref1.current;  
        var instances = M.FormSelect.init(select);
    }
    /**
     * Initialize Google Materialize selection menu upon component mounting. 
     */

    render() {
        const ref1 = this.props.ref1;
        return (
            <div className="row">
                <div className="col s12 m6">
                    <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Local or Global?</span>
                        <p> Select whether you wish to gather tweets from around the world ("Global") or 
                        if you wish to gather tweets within a certain region ("Geographical"). 
                        All Geographical Mode searches require a location and will be made within a certain radius
                        of that location (in km).
                        </p>
                    </div>
                    </div>
                </div>
                <div className="input-field col s6" onChange={this.props.toggle}>
                    <select id="Mode Select" ref={ref1} required defaultValue={'DEFAULT'}>
                    <option value="DEFAULT" disabled>Choose your mode</option>
                    <option value="global">Global</option>
                    <option value="geographical">Geographical</option>
                    </select>
                    <label>Mode Select:</label>
                </div>
            </div>    
        )
    }
}

/**
 * ModeSelect component contains elements and functionalities to enable or disable a geographical tweet search. 
 * Select menu choice moderates 'geoState' state information in SearchForm, which enables or disables the geographical search inputs. 
 */

export default ModeSelect; 