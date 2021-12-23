import {SET_STATUS_CODE, START_GAME,START_FIGHT} from "../types/game";

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

export function startFight() {
    return {
        type: START_FIGHT
    }
}