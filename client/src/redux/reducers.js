import {SET_STATUS_CODE} from "./types";

const initialState = {
    statusCode: 0
}

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATUS_CODE:
            return {
                ...state,
                statusCode: action.payload
            }
        default:
            return state
    }
}