import { ACTIVE_PAGE } from "../constants";

export default function(state=[],action){
    switch(action.type){
        case ACTIVE_PAGE:
            return action.payload;
        default:
            return state
    }
}