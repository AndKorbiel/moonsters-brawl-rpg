import {HANDLE_EDIT_MODE, SET_NEW_NAME, CHANGE_STATS} from "../types/character";

const initialState = {
    name: 'Moonster',
    image: 'assets/images/frank.png',
    level: 1,
    points: 5,
    stats: [
        {name: 'attack', value: 10},
        {name: 'defense', value: 10},
        {name: 'life', value: 10},
    ],
    isEditing: false
}

export default function character(state = initialState, action) {
    switch (action.type) {
        case HANDLE_EDIT_MODE:
            return {
                ...state,
                isEditing: action.payload
            }
        case SET_NEW_NAME:
            return {
                ...state,
                name: action.payload
            }
        case CHANGE_STATS:
            return {
                ...state,
                stats: action.payload
            }
        default:
            return state
    }
}