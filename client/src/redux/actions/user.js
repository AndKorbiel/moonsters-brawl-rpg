import {SET_CURRENT_USER} from '../types/user';

export function setCurrentUser(userData) {
    return {
        type: SET_CURRENT_USER,
        payload: userData
    }
}