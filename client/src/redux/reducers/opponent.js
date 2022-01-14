import {LEVEL_UP} from "../types/opponent";

const initialState = {
    name: 'Slayer',
    level: 1,
    image: 'assets/images/frank.png',
    points: 0,
    stats: [
        {name: 'attack', value: 10},
        {name: 'defense', value: 10},
        {name: 'life', value: 10},
    ],
}

export default function opponent(state = initialState, action) {
    switch (action.type) {
        case LEVEL_UP:
            return {
                ...state,
                level: action.payload.level,
                points: action.payload.points
            }
        default:
            return state
    }
}