import { SET_CURRENT_USER, SET_SAVED_GAMES } from '../constants/user';
import type { ActionType, SavedGame, UserState } from '../../types';

export function setCurrentUser(userData: UserState['currentUser']) {
  return {
    type: SET_CURRENT_USER,
    payload: userData,
  } satisfies ActionType;
}

export function setSavedGames(gameData: SavedGame[]) {
  return {
    type: SET_SAVED_GAMES,
    payload: gameData,
  } satisfies ActionType;
}
