import game from './game';
import character from './character';
import shop from './shop';
import opponent from './opponent';
import user from './user';
import { Reducer, combineReducers } from 'redux';
import { GAME_OVER, LOAD_GAME } from '../constants/game';
import { ActionType, AppState } from '../../types';

const appReducer: Reducer<AppState, ActionType> = combineReducers({
  game,
  character,
  shop,
  opponent,
  user,
});

export const rootReducer = (state: AppState, action: ActionType) => {
  switch (action.type) {
    case GAME_OVER:
      return appReducer(undefined, action);
    case LOAD_GAME:
      return {
        ...state,
        game: action.payload.game,
        character: action.payload.character,
        opponent: action.payload.opponent,
        shop: action.payload.shop,
      };
    default:
      return appReducer(state, action);
  }
};
