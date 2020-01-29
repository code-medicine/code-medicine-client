const PROTOCOL = 'http';
const ADDRESS = '192.168.10.3';
const PORT = '5000';

export const BASE_URL = `${PROTOCOL}://${ADDRESS}:${PORT}`;
export const BASE_USERS_URL = `${BASE_URL}/users`;
export const REGISTER_USER_REQUEST = `${BASE_USERS_URL}/register`;
export const LOGIN_USER_REQUEST = `${BASE_USERS_URL}/login`;
export const PROFILE_USER_REQUEST = `${BASE_USERS_URL}/profile`;
