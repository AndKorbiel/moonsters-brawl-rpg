import type { ActionType, UserState } from '../../types';
import { SET_CURRENT_USER, SET_SAVED_GAMES } from '../constants/user';

const initialState: UserState = {
  currentUser: {},
  savedGames: {},
};

export default function user(state = initialState, action: ActionType) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case SET_SAVED_GAMES:
      return {
        ...state,
        savedGames: action.payload,
      };
    default:
      return state;
  }
}
