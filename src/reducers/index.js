import { combineReducers } from 'redux';
import Notify from './reducer_notify';
import Left_sidebar from './reducer_sidebar_controls';
import Active_user from './reducer_active_user';
import Active_page from './reducer_active_page';
import Todays_patient from './reducer_todays_patients';

const root_reducer = combineReducers({
    notify: Notify,
    left_sidebar: Left_sidebar,
    active_user: Active_user,
    active_page: Active_page,
    todays_patient: Todays_patient
});

export default root_reducer