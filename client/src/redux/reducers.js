import {CHANGE_STATUS} from "./types";

const initialState = {
    status: 'In Main Menu'
};

export default function MainReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_STATUS:
            return {
                ...state,
                status: action.payload
            }
        default:
            return state
    }
}