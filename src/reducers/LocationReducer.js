import Immutable from 'immutable'
import { handleActions } from 'redux-actions'

import * as ActionTypes from '../actions/LocationActions'

const initialState = Immutable.fromJS({
	customersData: {},
    locationsData: {},
    locationById: {}
});

export default handleActions({
    [ActionTypes.SET_LOCATION_PROPERTY]: (state, action) => {
        return state.merge( action.payload );
    },

    [ActionTypes.SET_CURRENT_DATE]: (state, action) => {
        return state.merge( action.payload );
    },

    [ActionTypes.GET_COMPANY_NAME_REQUEST]: (state, action) => {
        return state.set('customersData', Immutable.Map({
            isFetching: true,
            isError: false
        }));
    },
    [ActionTypes.GET_COMPANY_NAME_SUCCESS]: (state, action) => {
        return state.set('customersData', Immutable.Map({
            isFetching: false,
            isError: false,
            data: action.payload
        }));
    },
    [ActionTypes.GET_COMPANY_NAME_FAILURE]: (state, action) => {
        return state.set('customersData', Immutable.Map({
            isFetching: false,
            isError: true
        }));
    },

    [ActionTypes.GET_LOCATION_NAME_REQUEST]: (state, action) => {
        return state.set('locationsData', Immutable.Map({
            isFetching: true,
            isError: false
        }));
    },
    [ActionTypes.GET_LOCATION_NAME_SUCCESS]: (state, action) => {
        return state.set('locationsData', Immutable.Map({
            isFetching: false,
            isError: false,
            data: action.payload
        }));
    },
    [ActionTypes.GET_LOCATION_NAME_FAILURE]: (state, action) => {
        return state.set('locationsData', Immutable.Map({
            isFetching: false,
            isError: true
        }));
    },

    [ActionTypes.GET_LOCATION_BY_ID_REQUEST]: (state, action) => {
        return state.set('locationById', Immutable.Map({
            isFetching: true,
            isError: false
        }));
    },
    [ActionTypes.GET_LOCATION_BY_ID_SUCCESS]: (state, action) => {
        return state.set('locationById', Immutable.Map({
            isFetching: false,
            isError: false,
            data: action.payload
        }));
    },
    [ActionTypes.GET_LOCATION_BY_ID_FAILURE]: (state, action) => {
        return state.set('locationById', Immutable.Map({
            isFetching: false,
            isError: true
        }));
    }
}, initialState);
