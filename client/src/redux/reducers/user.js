import { SET_CURRENT_USER, SET_SAVED_GAMES } from '../types/user';

const initialState = {
  currentUser: {},
  savedGames: {},
};

export default function user(state = initialState, action) {
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
