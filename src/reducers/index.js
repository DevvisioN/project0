import { combineReducers } from 'redux'

import locationData from './LocationReducer'
import CdrData from './CdrConferenceReducer'

const todoApp = combineReducers({ locationData, CdrData });

export default todoApp;
