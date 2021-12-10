import {SET_STATUS_CODE} from "./types";

export default function setStatusCode(statusCode) {
    return {
        type: SET_STATUS_CODE,
        payload: statusCode
    }
}