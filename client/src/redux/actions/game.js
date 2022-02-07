import {SET_STATUS_CODE, LOAD_GAME} from "../types/game";

export function setStatusCode(statusCode) {
    return {
        type: SET_STATUS_CODE,
        payload: statusCode
    }
}

export function loadGame(savedGame) {
    return {
        type: LOAD_GAME,
        payload: savedGame
    }
}