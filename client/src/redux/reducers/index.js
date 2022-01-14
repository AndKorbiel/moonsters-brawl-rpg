import game from "./game";
import character from "./character";
import shop from './shop';
import opponent from './opponent';
import { combineReducers } from 'redux'
import { GAME_OVER } from "../types/game";

const appReducer = combineReducers({
    game,
    character,
    shop,
    opponent
})

export const rootReducer = (state, action) => {
    if (action.type === 'GAME_OVER') {
        return appReducer(undefined, action)
    }

    return appReducer(state, action)
}