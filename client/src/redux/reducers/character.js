import { HANDLE_EDIT_MODE, SET_NEW_NAME, CHANGE_STATS, BUY_ITEM, DROP_ITEM, CALCULATE_STATS_FROM_ITEM } from "../types/character";

const initialState = {
    name: 'Moonster',
    image: 'assets/images/frank.png',
    level: 1,
    points: 5,
    stats: [
        { name: 'attack', value: 10 },
        { name: 'defense', value: 10 },
        { name: 'life', value: 20 },
    ],
    gold: 100,
    items: [],
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
                stats: action.payload.stats,
                points: action.payload.points,
                level: action.payload.level,
                gold: action.payload.gold
            }
        case BUY_ITEM:
            return {
                ...state,
                gold: state.gold - action.payload.price,
                items: [
                    ...state.items,
                    action.payload
                ]
            }
        case CALCULATE_STATS_FROM_ITEM:
            return {
                ...state,
                stats: state.stats.map(stat => {
                    return stat.name === action.payload.name ? { ...stat, value: stat.value + parseInt(action.payload.value) } : stat
                })
            }
        case DROP_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id)
            }
        default:
            return state
    }
}