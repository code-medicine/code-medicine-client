import { NOTIFY, LEFT_SIDEBAR, ACTIVE_USER } from "../shared/action_constants";


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
