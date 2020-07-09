const PROTOCOL = 'http';
// const ADDRESS = 'ec2-13-211-122-241.ap-southeast-2.compute.amazonaws.com'
// const ADDRESS = '54.79.159.117'
const ADDRESS = 'localhost'
const PORT = 6969;

export const BASE_URL = `${PROTOCOL}://${ADDRESS}:${PORT}`;

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