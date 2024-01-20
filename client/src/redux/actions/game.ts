import { SavedGame } from '../../types';
import { SET_STATUS_CODE, LOAD_GAME } from '../constants/game';

export function setStatusCode(statusCode: number) {
  return {
    type: SET_STATUS_CODE,
    payload: statusCode,
  };
}

export function loadGame(savedGame: SavedGame) {
  return {
    type: LOAD_GAME,
    payload: savedGame,
  };
}
