import { LEFT_SIDEBAR } from "../shared/action_constants";

export default function (state=false,action){
    switch(action.type){
        case LEFT_SIDEBAR:
            return action.payload
        default:
            return state
    }
}