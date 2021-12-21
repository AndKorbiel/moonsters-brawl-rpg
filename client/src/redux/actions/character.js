import {HANDLE_EDIT_MODE, SET_NEW_NAME, CHANGE_STATS, BUY_ITEM, DROP_ITEM, CALCULATE_STATS_FROM_ITEM} from "../types/character";

export function handleEditMode(value) {
    return {
        type: HANDLE_EDIT_MODE,
        payload: value
    }
}

export function setNewName(newName) {
    return {
        type: SET_NEW_NAME,
        payload: newName
    }
}

export function changeStats(value) {
    return {
        type: CHANGE_STATS,
        payload: value
    }
}

export function buyItem(item) {
    return {
        type: BUY_ITEM,
        payload: item
    }
}

export function calculateStatsFromItem(item) {
    return {
        type: CALCULATE_STATS_FROM_ITEM,
        payload: item[0]
    }
}

export function dropItem(item) {
    return {
        type: DROP_ITEM,
        payload: item
    }
}