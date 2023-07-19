import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '@/store/reducers'

import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

/**
 * 中间件
 * @type {*[]}
 */
const middleware = [thunk];

const enhancer = composeWithDevTools(
    applyMiddleware(...middleware),
);

export default createStore(
    rootReducer,
    enhancer
);