import game from "./game";
import character from "./character";
import shop from './shop';
import opponent from './opponent';
import { combineReducers } from 'redux'

export default combineReducers({
    game,
    character,
    shop,
    opponent
})