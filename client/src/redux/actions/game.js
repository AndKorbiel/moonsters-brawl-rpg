import {SET_STATUS_CODE, START_GAME} from "../types/game";

export function setStatusCode(statusCode) {
    return {
        type: SET_STATUS_CODE,
        payload: statusCode
    }
}

export function startGame() {
    return {
        type: START_GAME
    }
}