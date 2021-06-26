
import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore((reducers), composeWithDevTools(applyMiddleware(promise, thunk)));

export default store;