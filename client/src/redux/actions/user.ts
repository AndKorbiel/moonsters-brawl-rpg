import { SET_CURRENT_USER, SET_SAVED_GAMES } from '../constants/user';

export function setCurrentUser(userData) {
  return {
    type: SET_CURRENT_USER,
    payload: userData,
  };
}

export function setSavedGames(gameData) {
  return {
    type: SET_SAVED_GAMES,
    payload: gameData,
  };
}
