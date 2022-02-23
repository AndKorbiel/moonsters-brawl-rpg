import {SET_CURRENT_USER} from '../types/user';

const initialState = {
    currentUser: {}
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        default:
            return state
    }
}