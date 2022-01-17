import {LEVEL_UP, RESET_STATS} from '../types/opponent';

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