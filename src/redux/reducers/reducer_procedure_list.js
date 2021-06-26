import { FETCH_PROCEDURE_LIST } from "redux/constants";

export default function (state={}, action) {
    switch (action.type) {
        case FETCH_PROCEDURE_LIST:
            return action.payload;    
        default:
            return state;
    }
}