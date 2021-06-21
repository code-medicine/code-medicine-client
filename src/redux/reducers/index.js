import { combineReducers } from 'redux';
import Notify from './reducer_notify';
import Left_sidebar from './reducer_sidebar_controls';
import Active_user from './reducer_active_user';
import Active_page from './reducer_active_page';
import Todays_patient from './reducer_todays_patients';
import Settings from './reducer_settings';
import Doctors from './reducer_doctors';
import ProceduresList from './reducer_procedure_list';

const root_reducer = combineReducers({
    notify: Notify,
    left_sidebar: Left_sidebar,
    active_user: Active_user,
    active_page: Active_page,
    todays_patient: Todays_patient,
    settings: Settings,
    doctors: Doctors,
    proceduresList: ProceduresList,
    
});

export default root_reducer