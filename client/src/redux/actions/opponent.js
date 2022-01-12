import {LEVEL_UP} from '../types/opponent';

export function levelUp(stats) {
    return {
        type: LEVEL_UP,
        payload: stats
    }
}