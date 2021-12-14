import {HANDLE_EDIT_MODE, SET_NEW_NAME, CHANGE_STATS} from "../types/character";

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