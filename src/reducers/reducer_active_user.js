import { ACTIVE_USER } from "../shared/action_constants";

export default function(state={},action){
    switch(action.type){
        case ACTIVE_USER:
            return action.payload;
        default:
            return state
    }
}