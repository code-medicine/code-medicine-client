import { ACTIVE_USER } from "../constants";

export default function (state = {}, action) {
    switch (action.type) {
        case ACTIVE_USER:
            return action.payload;
        default:
            return state
    }
}