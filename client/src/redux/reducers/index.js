import game from "./game";
import character from "./character";
import shop from './shop';
import opponent from './opponent';
import user from './user';
import date from './date';
import { combineReducers } from 'redux'
import { GAME_OVER, LOAD_GAME } from "../types/game";

const appReducer = combineReducers({
    game,
    character,
    shop,
    opponent,
    user,
    date
})

export const rootReducer = (state, action) => {
    switch (action.type) {
        case GAME_OVER:
            state = undefined
            break;
        case LOAD_GAME:
            return {
                ...action.payload
            }
        default:
    }

    return appReducer(state, action)
}