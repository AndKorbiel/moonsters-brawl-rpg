import {LEVEL_UP} from "../types/opponent";

const initialState = {
    name: 'Slayer',
    level: 1,
    image: 'assets/images/frank.png',
    points: 35,
    stats: [
        {name: 'attack', value: 0},
        {name: 'defense', value: 0},
        {name: 'life', value: 0},
    ],
}

export default function opponent(state = initialState, action) {
    switch (action.type) {
        case LEVEL_UP:
            return {
                ...state,
                level: action.payload.level,
                stats: action.payload.stats
            }
        default:
            return state
    }
}