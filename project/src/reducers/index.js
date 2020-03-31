import { combineReducers } from 'redux';
import Notify from './reducer_notify';
import Left_sidebar from './reducer_sidebar_controls';
import Active_user from './reducer_active_user';
import Active_page from './reducer_active_page';

const root_reducer = combineReducers({
    notify: Notify,
    left_sidebar: Left_sidebar,
    active_user: Active_user,
    active_page: Active_page,
});

export default root_reducer