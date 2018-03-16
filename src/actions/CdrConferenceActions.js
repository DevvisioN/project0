import { CALL_API } from 'redux-api-middleware'
import querystring from 'querystring'

import { REST_API_PREFIX } from '../constants/Constants'

export const GET_CDR_REQUEST = 'GET_CDR_REQUEST'
export const GET_CDR_SUCCESS = 'GET_CDR_SUCCESS'
export const GET_CDR_FAILURE = 'GET_CDR_FAILURE'

export function getTestData( data ) {
    return {
        type: GET_CDR_SUCCESS,
        payload: {
            data: data
        }
    }
}

export function getCDR( params ) {
    return (dispatch) => {
        return dispatch({
            [CALL_API]: {
                endpoint: `${REST_API_PREFIX}/conference?${querystring.stringify(params)}`,
                method: 'GET',
                types: [GET_CDR_REQUEST, GET_CDR_SUCCESS, GET_CDR_FAILURE],
            }
        });
    };
}

export const LOOKUP_RESULT_REQUEST = 'LOOKUP_RESULT_REQUEST'
export const LOOKUP_RESULT_SUCCESS = 'LOOKUP_RESULT_SUCCESS'
export const LOOKUP_RESULT_FAILURE = 'LOOKUP_RESULT_FAILURE'

export function getlookupResults(ip) {
    return (dispatch) => {
        return dispatch({
            [CALL_API]: {
                method: 'GET',
                endpoint: `http://ossui.star2star.net/oss-ui/rest/whoIs/${ip}`,
                types: [LOOKUP_RESULT_REQUEST, LOOKUP_RESULT_SUCCESS, LOOKUP_RESULT_FAILURE]
            }
        });
    };
}



