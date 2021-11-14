import { TODAYS_PATIENT, TODAYS_PATIENT_CLEAR, TODAYS_PATIENT_APPOINTMENT_UPDATE } from "../constants";

export default function (state = {}, action) {
    switch (action.type) {
        case TODAYS_PATIENT:
            console.log('todays patients', action.payload)
            if (action.payload.status === 200)
                return { 
                    loading: action.loading, 
                    data: action.payload.data.payload
                }
            else
                return { 
                    loading: action.loading, 
                    data: []
                }
        case TODAYS_PATIENT_CLEAR:
            return { loading: true, data: [] }
        case TODAYS_PATIENT_APPOINTMENT_UPDATE:
            if (action.payload.new_item !== undefined){
                return state.data.map((item,i) => {
                    if (item._id !== action.payload.id) {
                        // This isn't the item we care about - keep it as-is
                        return item
                    }
                    return {
                        ...item,
                        ...action.payload.new_item
                    }
                })
            }
            else{
                return state.data
            }

        default:
            return state
    }
}