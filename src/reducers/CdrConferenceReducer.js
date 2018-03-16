import Immutable from 'immutable'
import { handleActions } from 'redux-actions'

import * as ActionTypes from '../actions/CdrConferenceActions'

const initialState = Immutable.fromJS({
    cdr: {},
    lookup: {}
});

export default handleActions({
    [ActionTypes.GET_CDR_REQUEST]: (state, action) => {
        return state.set('cdr', Immutable.Map({
            isFetching: true,
            isError: false
        }));
    },
    [ActionTypes.GET_CDR_SUCCESS]: (state, action) => {
        return state.set('cdr', Immutable.Map({
            isFetching: false,
            isError: false,
            data: action.payload
        }));
    },
    [ActionTypes.GET_CDR_FAILURE]: (state, action) => {
        return state.set('cdr', Immutable.Map({
            isFetching: false,
            isError: true
        }));
    },
    [ActionTypes.LOOKUP_RESULT_REQUEST]: (state, action) => {
        return state.set('lookup', Immutable.Map({
            isFetching: true,
            isError: false
        }));
    },
    [ActionTypes.LOOKUP_RESULT_SUCCESS]: (state, action) => {
        return state.set('lookup', Immutable.Map({
            isFetching: false,
            isError: false,
            data: action.payload
        }));
    },
    [ActionTypes.LOOKUP_RESULT_FAILURE]: (state, action) => {
        return state.set('lookup', Immutable.Map({
            isFetching: false,
            isError: true
        }));
    }
}, initialState);
