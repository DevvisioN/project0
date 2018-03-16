import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { apiMiddleware } from 'redux-api-middleware'

export default function configureStore (initialState = {}) {
    let middlewares = applyMiddleware(apiMiddleware, thunk)

    const store = middlewares(createStore)(rootReducer, initialState)

    return store
}
