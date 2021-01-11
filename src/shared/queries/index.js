import Axios from "axios"
import * as rep from '../rest_end_points';

export const CreateNewPaymentLog = (payload) => {
    return Axios.post(rep.PAYMENTS_CREATE, payload);
}

export const GetUserById = (id) => {
    return Axios.post(rep.USERS_SEARCH_BY_ID, { user_id: id })
}