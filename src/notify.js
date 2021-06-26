import { toast } from 'react-toastify';


export default function Notify(type, title, message) {
    const options = {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnFocusLoss: true
    }
    switch (type) {
        case 'success':
            return toast.success(message, options);
        case 'error':
            return toast.error(message, options);
        case 'warning':
            return toast.warn(message, options);
        case 'info':
            return toast.info(message, options);
        default:
            return toast(message, options);
    }
}