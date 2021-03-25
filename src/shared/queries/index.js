import Axios from "axios"
import * as rep from '../rest_end_points';

/**
 * ------------------------------------------------------------------------------
 * General Queries
 * ------------------------------------------------------------------------------
 */

export const PostRequest = (url, data) => {
    return Axios.post(url, data);
}

export const GetRequest = (url) => {
    return Axios.get(url);
}

/**
 * ------------------------------------------------------------------------------
 * User Queries
 * ------------------------------------------------------------------------------
 */

export const GetUserById = (id) => {
    return Axios.post(rep.USERS_SEARCH_BY_ID, { user_id: id })
}

export const LoginRequest = (data) => {
    return Axios.post(rep.USERS_LOGIN, data);
}

export const UsersSearchByToken = (token) => {
    return Axios.get(`${rep.USERS_SEARCH_BY_TOKEN}?tag=${token}`)
}

export const UserSearchByToken = (token) => {
    return Axios.get(`${rep.USERS_SEARCH_BY_TOKEN}?tag=${token}`)
}

export const UserUpdate = (data) => {
    return Axios.put(rep.USERS_UPDATE, data)
}

export const UserSearchById = (id) => {
    return Axios.post(rep.USERS_SEARCH_BY_ID, { user_id: id })
}

/**
 * ------------------------------------------------------------------------------
 * Appointment Queries
 * ------------------------------------------------------------------------------
 */

export const AppointmentsSearchToday = (date, type = "") => {
    if (type !== "")
        return Axios.get(`${rep.APPOINTMENTS_SEARCH_TODAY}?tag=${new Date(new Date(date.getTime() + (date.getTimezoneOffset() * 60000)).toISOString())}&type=${type}`);
    else
        return Axios.get(`${rep.APPOINTMENTS_SEARCH_TODAY}?tag=${new Date(date)}`)
}

export const AppointmentCheckout = (id) => {
    return Axios.post(rep.APPOINTMENTS_CHECKOUT, { appointment_id: id });
}

export const AppointmentCreate = (data) => {
    return Axios.post(rep.APPOINTMENTS_CREATE, data)
}

export const AppointmentUpdate = (data) => {
    return Axios.put(rep.APPOINTMENTS_UPDATE, data)
}

export const AppointmentCharges = (id) => {
    return Axios.get(`${rep.APPOINTMENTS_CHARGES}?tag=${id}`)
}

export const AppointmentUpdateCharges = (payload) => {
    return Axios.put(rep.APPOINTMENTS_CHARGES_UPDATE, payload)
}

export const AppointmentSearchById = (id) => {
    return Axios.get(`${rep.APPOINTMENTS_SEARCH_BY_ID}?tag=${id}`)
}

export const AppointmentInvoice = (id) => {
    return Axios.get(`${rep.APPOINTMENTS_INVOICE}?tag=${id}`)
}
/**
 * ------------------------------------------------------------------------------
 * Procedure Queries
 * ------------------------------------------------------------------------------
 */

export const ProcedureSearchByAppointmentId = (id) => {
    return Axios.get(`${rep.PROCEDURES_SEARCH_BY_APPOINTMENT_ID}?tag=${id}`)
}

export const ProcedureCreate = (data) => {
    return Axios.post(rep.PROCEDURES_CREATE, data);
}

export const ProcedureUpdate = (payload) => {
    return Axios.put(rep.PROCEDURES_UPDATE, payload)
}

export const ProcedureDelete = (id) => {
    return Axios.delete(rep.PROCEDURES_DELETE, { data: { procedure_id: id } })
}


/**
 * ------------------------------------------------------------------------------
 * Payments Queries
 * ------------------------------------------------------------------------------
 */

 export const CreateNewPaymentLog = (payload) => {
    return Axios.post(rep.PAYMENTS_CREATE, payload);
}



