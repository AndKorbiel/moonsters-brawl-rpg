import {LEVEL_UP, RESET_STATS, SET_NAME, SET_IMAGE} from '../types/opponent';

export function levelUp(stats) {
    return {
        type: LEVEL_UP,
        payload: stats
    }
}

export function resetStats(stats) {
    return {
        type: RESET_STATS,
        payload: stats
    }
}

export function setName(name) {
    return {
        type: SET_NAME,
        payload: name
    }
}

export function setImage(number) {
    return {
        type: SET_IMAGE,
        payload: number
    }
}