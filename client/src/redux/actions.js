import {CHANGE_STATUS} from "./types";

export function changeStatus(newStatus) {
    return {
        type: CHANGE_STATUS,
        payload: newStatus
    }
}