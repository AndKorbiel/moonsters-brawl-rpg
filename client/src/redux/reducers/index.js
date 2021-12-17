import game from "./game";
import character from "./character";
import shop from './shop';
import { combineReducers } from 'redux'

export default combineReducers({
    game,
    character,
    shop
})