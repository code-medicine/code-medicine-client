import { TODAYS_PATIENT, TODAYS_PATIENT_CLEAR } from "../shared/action_constants";

export default function (state = {}, action) {
    switch (action.type) {
        case TODAYS_PATIENT:
            if (action.payload.data.status === true)
                return { loading: action.loading, data: action.payload.data.payload }
            else
                return { loading: action.loading, data: action.payload }
        case TODAYS_PATIENT_CLEAR:
            return { loading: true, data: [] }
        default:
            return state
    }
}