import { combineReducers } from 'redux';
import Notify from './reducer_notify';

const root_reducer = combineReducers({
    notify: Notify
});

export default root_reducer