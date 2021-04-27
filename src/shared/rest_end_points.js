const PROTOCOL = 'http';

/**
 * production address
 */
// const ADDRESS = '18.188.119.132'
// const ADDRESS = 'codemedicine.ddns.net'
// const TYPE = '/test';
// export const ROOT_URL = `${PROTOCOL}://${ADDRESS}`;
// export const SOCKET_URL = `${TYPE}/socket.io`;

/**
 * developement address
 */
const ADDRESS = 'localhost'
const PORT = 7000;
const TYPE = '/test';
export const ROOT_URL = `${PROTOCOL}://${ADDRESS}:${PORT}`;
export const SOCKET_URL = `${TYPE}/socket.io`; 

export const BASE_URL = `${ROOT_URL}${TYPE}`;
 
export const USERS_BASE_URL = `${BASE_URL}/users`;
export const USERS_LOGIN = `${USERS_BASE_URL}/login`;
export const USERS_CREATE = `${USERS_BASE_URL}/register`;
export const USERS_UPDATE = `${USERS_BASE_URL}/update`;
export const USERS_DELETE = `${USERS_BASE_URL}/delete`;
export const USERS_LOGOUT = `${USERS_BASE_URL}/logout`;
export const USERS_SEARCH_BY_ID = `${USERS_BASE_URL}/search/id`;
export const USERS_SEARCH_BY_TOKEN = `${USERS_BASE_URL}/search/token`;
export const USERS_SEARCH_BY_CREDENTIALS = `${USERS_BASE_URL}/search/credentials`;
 
export const ADMIN_BASE_URL = `${USERS_BASE_URL}/admin`;
export const ADMIN_CREATE_PATIENT = `${ADMIN_BASE_URL}/patient/create`;
export const ADMIN_UPDATE_PATIENT = `${ADMIN_BASE_URL}/patient/update`;
export const ADMIN_DELETE_PATIENT = `${ADMIN_BASE_URL}/patient/delete`;
export const ADMIN_CREATE_DOCTOR =  `${ADMIN_BASE_URL}/doctor/create`;
export const ADMIN_UPDATE_DOCTOR =  `${ADMIN_BASE_URL}/doctor/update`;
export const ADMIN_DELETE_DOCTOR =  `${ADMIN_BASE_URL}/doctor/delete`;

export const APPOINTMENTS_BASE_URL = `${BASE_URL}/appointments`;
export const APPOINTMENTS_CREATE = `${APPOINTMENTS_BASE_URL}/create`;
export const APPOINTMENTS_UPDATE = `${APPOINTMENTS_BASE_URL}/update`;
export const APPOINTMENTS_DELETE = `${APPOINTMENTS_BASE_URL}/delete`;
export const APPOINTMENTS_SEARCH = `${APPOINTMENTS_BASE_URL}/search`;
export const APPOINTMENTS_SEARCH_BY_ID = `${APPOINTMENTS_BASE_URL}/search/id`;
export const APPOINTMENTS_SEARCH_TODAY = `${APPOINTMENTS_BASE_URL}/search/today`;
export const APPOINTMENTS_CHARGES = `${APPOINTMENTS_BASE_URL}/charges`
export const APPOINTMENTS_CHARGES_UPDATE = `${APPOINTMENTS_CHARGES}/update`
export const APPOINTMENTS_INVOICE = `${APPOINTMENTS_BASE_URL}/invoice`
export const APPOINTMENTS_CHECKOUT = `${APPOINTMENTS_BASE_URL}/checkout`
 
export const PROCEDURES_BASE_URL = `${BASE_URL}/procedures`;
export const PROCEDURES_CREATE = `${PROCEDURES_BASE_URL}/create`;
export const PROCEDURES_UPDATE = `${PROCEDURES_BASE_URL}/update`;
export const PROCEDURES_DELETE = `${PROCEDURES_BASE_URL}/delete`;
export const PROCEDURES_SEARCH = `${PROCEDURES_BASE_URL}/search`;
export const PROCEDURES_SEARCH_BY_ID = `${PROCEDURES_BASE_URL}/search/id`;
export const PROCEDURES_SEARCH_BY_APPOINTMENT_ID = `${PROCEDURES_BASE_URL}/appointment/id`;

export const DOCTORDETAILS_BASE_URL = `${BASE_URL}/doctor/details`;
export const DOCTORDETAILS_CREATE = `${DOCTORDETAILS_BASE_URL}/create`;
export const DOCTORDETAILS_UPDATE = `${DOCTORDETAILS_BASE_URL}/update`;
export const DOCTORDETAILS_DELETE = `${DOCTORDETAILS_BASE_URL}/delete`;
export const DOCTORDETAILS_SEARCH_BY_ID = `${DOCTORDETAILS_BASE_URL}/search/id`;

export const BRANCHES_BASE_URL = `${BASE_URL}/branches`;
export const BRANCHES_CREATE = `${BRANCHES_BASE_URL}/create`;
export const BRANCHES_UPDATE = `${BRANCHES_BASE_URL}/update`;
export const BRANCHES_DELETE = `${BRANCHES_BASE_URL}/delete`;
export const BRANCHES_SEARCH_BY_ID = `${BRANCHES_BASE_URL}/search/id`;

export const PAYMENTS_BASE_URL = `${BASE_URL}/payments`;
export const PAYMENTS_CREATE = `${PAYMENTS_BASE_URL}/create`;
export const PAYMENTS_UPDATE = `${PAYMENTS_BASE_URL}/update`;
export const PAYMENTS_DELETE = `${PAYMENTS_BASE_URL}/delete`;
export const PAYMENTS_SEARCH_BY_ID = `${PAYMENTS_BASE_URL}/search/id`;


// --------------------------------------------------------------------------------------------------------------------


// All user related end points
export const BASE_USERS_URL = `${BASE_URL}/users`;
export const REGISTER_USER_REQUEST = `${BASE_USERS_URL}/register`;
export const REGISTER_USER_REQUEST_BY_ADMIN = `${REGISTER_USER_REQUEST}/admin`;
export const LOGIN_USER_REQUEST = `${BASE_USERS_URL}/login`;
export const LOGOUT_USER_REQUEST = `${BASE_USERS_URL}/logout`;
export const PROFILE_USER_REQUEST = `${BASE_USERS_URL}/profile`;
export const PROFILE_UPDATE_USER_REQUEST = `${PROFILE_USER_REQUEST}/update`;
export const SEARCH_USER_REQUEST = `${BASE_USERS_URL}/search`;
export const SEARCH_BY_ID_USER_REQUEST = `${BASE_USERS_URL}/search/id`;

// All visits/reception related end points
// export const BASE_RECEPTION_URL = `${BASE_URL}/visits`;
// export const NEW_APPOINTMENT_URL = `${BASE_RECEPTION_URL}/new`;
// export const UPDATE_APPOINTMENT_URL = `${BASE_RECEPTION_URL}/update`
// export const SEARCH_APPOINTMENTS_URL = `${BASE_RECEPTION_URL}/search`;
// export const SEARCH_TODAYS_APPOINTMENTS_URL = `${SEARCH_APPOINTMENTS_URL}/today`;

export const BASE_RECEPTION_URL = `${BASE_URL}/appointments`;
export const NEW_APPOINTMENT_URL = `${BASE_RECEPTION_URL}/create`;
export const UPDATE_APPOINTMENT_URL = `${BASE_RECEPTION_URL}/update`
export const SEARCH_APPOINTMENTS_URL = `${BASE_RECEPTION_URL}/search`;
export const SEARCH_APPOINTMENT_BY_ID = `${SEARCH_APPOINTMENTS_URL}/id`;
export const SEARCH_TODAYS_APPOINTMENTS_URL = `${SEARCH_APPOINTMENTS_URL}/today`;
export const GET_APPOINTMENT_CHARGES = `${BASE_RECEPTION_URL}/charges`;
export const UPDATE_APPOINTMENT_CHARGES = `${GET_APPOINTMENT_CHARGES}/update`;
export const CHECKOUT_APPOINTMENT = `${BASE_RECEPTION_URL}/checkout`;
export const GET_INVOICE_DATA = `${BASE_RECEPTION_URL}/invoice`;

// All procedure related end points
export const BASE_PROCEDURES_URL = `${BASE_RECEPTION_URL}/procedures`;
export const NEW_PROCEDURES_URL = `${BASE_PROCEDURES_URL}/create`;
export const UPDATE_PROCEDURE_URL = `${BASE_PROCEDURES_URL}/update`;
export const DELETE_PROCEDURE_URL = `${BASE_PROCEDURES_URL}/delete`;

// All profit related end points
export const BASE_PROFITS_URL = `${BASE_URL}/profits`;
export const GET_PROFITS_BY_DOCTOR_ID = `${BASE_PROFITS_URL}/search/visit/id`;
export const PROFITS_UPDATE = `${BASE_PROFITS_URL}/update`;

// All profit related end points
export const BASE_DOCTORDETAILS__URL = `${BASE_URL}/doctordetails`;
export const DOCTORDETAILS_SEARCH = `${BASE_DOCTORDETAILS__URL}/search`;
