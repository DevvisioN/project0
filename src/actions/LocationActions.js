import { CALL_API } from 'redux-api-middleware'

import { REST_API_PREFIX, STARBOX_API_PREFIX } from '../constants/Constants'

export const SET_LOCATION_PROPERTY = 'SET_LOCATION_PROPERTY'
export const SET_CURRENT_DATE = 'SET_CURRENT_DATE'

export function setCustomerData( company ) {
    return {
        type: SET_LOCATION_PROPERTY,
        payload: {
            company: company
        }
    }
}

export function setLocationData( location ) {
    return {
        type: SET_LOCATION_PROPERTY,
        payload: {
            locationData: location
        }
    }
}

export function setStartDate(startDate){
    return {
        type: SET_CURRENT_DATE,
        payload: {
            startDate: startDate
        }
    }
}

export function setEndDate(endDate){
    return {
        type: SET_CURRENT_DATE,
        payload: {
            endDate: endDate
        }
    }  
}

export const GET_LOCATION_BY_ID_REQUEST = 'GET_LOCATION_BY_ID_REQUEST'
export const GET_LOCATION_BY_ID_SUCCESS = 'GET_LOCATION_BY_ID_SUCCESS'
export const GET_LOCATION_BY_ID_FAILURE = 'GET_LOCATION_BY_ID_FAILURE'

export function getLocationById( locationID ) {
    return (dispatch) => {
        return dispatch({
            [CALL_API]: {
                endpoint: `${REST_API_PREFIX}/locations/${locationID}`,
                method: 'GET',
                types: [GET_LOCATION_BY_ID_REQUEST, GET_LOCATION_BY_ID_SUCCESS, GET_LOCATION_BY_ID_FAILURE],
            }
        });
    };
}

export const GET_COMPANY_NAME_REQUEST = 'GET_COMPANY_NAME_REQUEST'
export const GET_COMPANY_NAME_SUCCESS = 'GET_COMPANY_NAME_SUCCESS'
export const GET_COMPANY_NAME_FAILURE = 'GET_COMPANY_NAME_FAILURE'

export function getCustomers( stringValue ) {
    let currentStringValue = stringValue != undefined ? stringValue.trim().replace(/\s/g, '_') : stringValue;

    return (dispatch) => {
        return dispatch({
            [CALL_API]: {
                endpoint:  `${REST_API_PREFIX}/customers?q=${currentStringValue}&limit=15`,
                method: 'GET',
                types: [GET_COMPANY_NAME_REQUEST, GET_COMPANY_NAME_SUCCESS, GET_COMPANY_NAME_FAILURE],
            }
        });
    };
}

export const GET_LOCATION_NAME_REQUEST = 'GET_LOCATION_NAME_REQUEST'
export const GET_LOCATION_NAME_SUCCESS = 'GET_LOCATION_NAME_SUCCESS'
export const GET_LOCATION_NAME_FAILURE = 'GET_LOCATION_NAME_FAILURE'

export function getLocation( customerID ) {
    return (dispatch) => {
        return dispatch({
            [CALL_API]: {
                endpoint: `${REST_API_PREFIX}/customers/${customerID}/locations`,
                method: 'GET',
                types: [GET_LOCATION_NAME_REQUEST, GET_LOCATION_NAME_SUCCESS, GET_LOCATION_NAME_FAILURE],
            }
        });
    };
}
