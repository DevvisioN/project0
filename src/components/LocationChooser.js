import 'react-select/dist/react-select.css'
import '../styles/locationChooser.less'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'

import { getCustomers, getLocation, getLocationById } from '../actions/LocationActions'

/* Location Chooser Component */
class LocationChooser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customersList: [],
            locationsList: [],
            
            customerValue: '',
            locationValue: '',
            
            locationByIdError: false,
            loadingLocations: false
        }

        this.searchTimer = 0;

        this.getLocationList = this.getLocationList.bind(this);
        this.customerSelected = this.customerSelected.bind(this);
        this.locationSelected = this.locationSelected.bind(this);
        this.getCustomerList = this.getCustomerList.bind(this);
    }

    getCustomerList(inputValue, callback){
        clearTimeout(this.searchTimer);    

        if(inputValue !== '') {
            let listOptions = [];

            this.searchTimer = setTimeout( () => {
                this.props.dispatch(getCustomers(inputValue)).then( response => {
                    if(response.error){
                        alert('Api error.');
                    }else{
                        response.payload.map( customer => {
                            listOptions.push({ value: customer.id, label: customer.name, customerID: customer.id });
                        });

                        this.setState({ customersList: listOptions });
                        callback(null, { options: listOptions });
                    }
                });
            }, 700);
        } else {
            callback(null, { options: this.state.customersList });
        }
    }

    getLocationList(customerID) {
        let locationsValues = [];
        
        this.props.dispatch(getLocation(customerID)).then( response => {
            if(response.error){
                alert('Api error.');
            }else{
                response.payload.map( location => {
                    locationsValues.push({ id: location.id , label: location.name, value: location.id });
                });

                this.setState({
                    locationsList: locationsValues,
                    loadingLocations: false
                });    
            }
            
        });
    }

    customerSelected(selectedCustomer) {
        if(selectedCustomer && selectedCustomer.length !== 0) {
            this.setState({
                customerValue: selectedCustomer,
                loadingLocations: true,
                locationByIdError: false
            });

            this.props.onCustomerChange(selectedCustomer);
            this.getLocationList(selectedCustomer.customerID);
        } else {
            this.props.onCustomerChange(null);

            this.setState({
                customerValue: '',
                locationValue: '',
                loadingLocations: false
            });                
        }
    }

    locationSelected(selectedLocation){
        let idRegex = /\d+/gi;

        if(selectedLocation && selectedLocation.className){
            if(selectedLocation.value.match(idRegex) !== null){
                selectedLocation.id = selectedLocation.value.match(idRegex).toString();

                this.props.dispatch(getLocationById(selectedLocation.id)).then( response =>{
                    if(response.error){
                        this.setState({locationByIdError: true});
                        this.props.onLocationChange(null);
                    }else{
                        let locationCurentValue = {
                            id: response.payload.id,
                            label: response.payload.name,
                            value: response.payload.id
                        };

                        this.setState({
                            locationValue: locationCurentValue,
                            locationByIdError: false
                        });
                        
                        this.props.onLocationChange(locationCurentValue);
                    }
                });
            }
        } else {
            this.setState({ locationValue: selectedLocation, locationByIdError: false });

            if(selectedLocation && selectedLocation.length !== 0) {
                this.props.onLocationChange(selectedLocation);
            } else {
                this.props.onLocationChange(null);
            }
        }
    }

    render() {
        return (
            <div className="form-group location-location-chooser">
                <div className="location-chooser">
                    <div className="location-chooser-select">
                        <div className="form-group">
                            { this.props.withHeaders ? <label htmlFor="customer" className="control-label">Customer</label> : null }
                            <Select.Async 
                                id="customer"
                                name="load-customers"
                                placeholder="Select customer"
                                clearable={ true }
                                cache={ false }
                                autoload={ false }
                                value={ this.state.customerValue && this.state.customerValue.length === 0 ? null : this.props.clearChooserValues ? null : this.state.customerValue }
                                loadOptions={ this.getCustomerList }
                                onChange={ this.customerSelected } />
                        </div>
                        <div className="form-group">
                            { this.props.withHeaders ? <label htmlFor="location" className="control-label">Location { this.props.clearChooserValues ? null : 
                                                        this.state.locationByIdError ? <span className='error-label'>| Wrong location id</span> : null }
                                                       </label> : null }
                            <Select.Creatable id="location"
                                name="load-location"
                                placeholder="Select Location"
                                clearable={ true }
                                searchable={ true }
                                allowCreate={ true }
                                isLoading={ this.state.loadingLocations }
                                options={ this.state.locationsList }
                                onChange={ this.locationSelected }
                                value={ this.state.locationValue && this.state.locationValue.length === 0 ? null : this.props.clearChooserValues ? null : this.state.locationValue } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LocationChooser.propTypes = {
    withHeaders: PropTypes.bool, //Set true/false value to show/hide headers;
    onLocationChange: PropTypes.func.isRequired, //Function to set location value in main component;
    onCustomerChange: PropTypes.func.isRequired, //Function to set customer value in main component;
    clearChooserValues: PropTypes.bool //Clear input values property;
}

export default connect()(LocationChooser);
