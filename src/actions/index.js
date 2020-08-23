import { NOTIFY, LEFT_SIDEBAR, 
    ACTIVE_USER, 
    ACTIVE_PAGE, 
    TODAYS_PATIENT, 
    TODAYS_PATIENT_CLEAR, 
    TODAYS_PATIENT_APPOINTMENT_UPDATE } from "../shared/action_constants";
import Axios from "axios";
import { SEARCH_TODAYS_APPOINTMENTS_URL, SEARCH_APPOINTMENT_BY_ID, APPOINTMENTS_SEARCH_TODAY } from "../shared/rest_end_points";

Axios.interceptors.request.use(request => {
    var user = localStorage.getItem('user');
    if (user) {
        request['headers']['code-medicine'] = `${user}`;
    }
    return request
})

export function notify(type,title,message){
    return {
        type: NOTIFY,
        payload: {
            type: type,
            title: title,
            message: message
        }
    }
    
}

export function left_sidebar_controls(status){
    return {
        type: LEFT_SIDEBAR,
        payload: status
    }
}

export function set_active_user(details){
    return {
        type: ACTIVE_USER,
        payload: details
    }
}

export function set_active_page(details){
    return {
        type: ACTIVE_PAGE,
        payload: details
    }
}

export function load_todays_appointments(date){
    return function(dispatch){
        // let d = new Date();
        // d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        Axios.get(`${APPOINTMENTS_SEARCH_TODAY}?tag=${new Date(date)}`)
        .then(res => {
            dispatch({
                type: TODAYS_PATIENT,
                payload: res,
                loading: false
            })
        })
        .catch(err => {
            dispatch({
                type: TODAYS_PATIENT,
                payload: {
                    data: {
                        message: err, 
                        loading: false
                    }
                }
            })
        })
    }
}

export function clear_todays_appointments(){
    return {
        type: TODAYS_PATIENT_CLEAR
    }
}

export function update_appointment(appointment_id){
    const response = Axios.get(`${SEARCH_APPOINTMENT_BY_ID}?tag=${appointment_id}`)
    return {
        type: TODAYS_PATIENT_APPOINTMENT_UPDATE,
        payload: {
            id: appointment_id,
            new_item: response.data
        }
    }
}