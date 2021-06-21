import { SETTINGS_UPDATE_LEFTSIDEBAR_LIST } from "../constants";
import _ from 'lodash';

const INITIAL_SETTINGS = {
    left_sidebar_collapsed: true,

}

export default function (state = INITIAL_SETTINGS, action) {
    switch (action.type) {
        case SETTINGS_UPDATE_LEFTSIDEBAR_LIST:
            const new_state = _.cloneDeep(state);
            new_state.left_sidebar_collapsed = !state.left_sidebar_collapsed
            return new_state;
        default:
            return state
    }
}