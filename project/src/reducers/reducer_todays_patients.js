import { TODAYS_PATIENT } from "../shared/action_constants";

export default function (state=[],action){
    switch(action.type){
        case TODAYS_PATIENT:
            return action.payload
        default:
            return state
    }
}