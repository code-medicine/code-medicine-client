import { NOTIFY } from "../constants";
import { toast } from 'react-toastify';


export default function(state={},action){
    switch (action.type){
        case NOTIFY:
            const options = {
                position: toast.POSITION.TOP_RIGHT,
                pauseOnFocusLoss: true
            }
            switch (action.payload['type']) {
                case 'success':
                    toast.success(action.payload['message'], options);
                    break;
                case 'error':
                    toast.error(action.payload['message'], options);
                    break;
                case 'warning':
                    toast.warn(action.payload['message'], options);
                    break;
                case 'info':
                    toast.info(action.payload['message'], options);
                    break;
                default:
                    toast(action.payload['message'], options);
            }
            return action.payload
        default:
            return state
    }
}