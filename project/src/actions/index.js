import { NOTIFY, LEFT_SIDEBAR, ACTIVE_USER, ACTIVE_PAGE, TODAYS_PATIENT, TODAYS_PATIENT_CLEAR } from "../shared/action_constants";
import Axios from "axios";
import { SEARCH_APPOINTMENTS_URL, SEARCH_TODAYS_APPOINTMENTS_URL } from "../shared/rest_end_points";


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

export function load_todays_appointments(){
    return function(dispatch){
        let d = new Date();
        d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        Axios.get(SEARCH_TODAYS_APPOINTMENTS_URL,{ headers: { 'code-medicine': localStorage.getItem('user') } })
        .then(res => {
            console.log("action response",res)
            dispatch({
                type: TODAYS_PATIENT,
                payload: res,
                loading: false
            })
        })
        .catch(err => {
            dispatch({
                type: TODAYS_PATIENT,
                payload: {"data": {"status": false, "message": "Network Error", loading: false}}
            })
        })
    }
}

export function clear_todays_appointments(){
    return {
        type: TODAYS_PATIENT_CLEAR
    }
}