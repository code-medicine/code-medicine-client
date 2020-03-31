const PROTOCOL = 'http';
// const ADDRESS = '39.33.186.49';
const ADDRESS = 'localhost'
const PORT = '5000';

export const BASE_URL = `${PROTOCOL}://${ADDRESS}:${PORT}`;

// All user related end points
export const BASE_USERS_URL = `${BASE_URL}/users`;
export const REGISTER_USER_REQUEST = `${BASE_USERS_URL}/register`;
export const LOGIN_USER_REQUEST = `${BASE_USERS_URL}/login`;
export const LOGOUT_USER_REQUEST = `${BASE_USERS_URL}/logout`;
export const PROFILE_USER_REQUEST = `${BASE_USERS_URL}/profile`;
export const PROFILE_UPDATE_USER_REQUEST = `${PROFILE_USER_REQUEST}/update`;
export const SEARCH_USER_REQUEST = `${BASE_USERS_URL}/search`;
export const SEARCH_BY_ID_USER_REQUEST = `${BASE_USERS_URL}/search/id`;

// All visits/reception related end points
export const BASE_RECEPTION_URL = `${BASE_URL}/visits`;
export const NEW_APPOINTMENT_URL = `${BASE_RECEPTION_URL}/new`;
export const SEARCH_APPOINTMENTS_URL = `${BASE_RECEPTION_URL}/search`;
export const SEARCH_TODAYS_APPOINTMENTS_URL = `${SEARCH_APPOINTMENTS_URL}/today`;

// All procedure related end points
export const BASE_PROCEDURES_URL = `${BASE_URL}/procedures`;
export const NEW_PROCEDURES_URL = `${BASE_PROCEDURES_URL}/new`;
export const GET_PROCEDURE_BY_ID = `${BASE_PROCEDURES_URL}/search/visit/id`;
export const GET_PROCEDURES_FEE = `${BASE_PROCEDURES_URL}/fees`;

// All profit related end points
export const BASE_PROFITS_URL = `${BASE_URL}/profits`;
export const GET_PROFITS_BY_DOCTOR_ID = `${BASE_PROFITS_URL}/search/doctor/id`;
