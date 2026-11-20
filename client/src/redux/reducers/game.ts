import type { ActionType, GameState } from '../../types';
import {
  GAME_STATUS,
  SET_STATUS_CODE,
  START_GAME,
  START_FIGHT,
} from '../constants/game';

const initialState: GameState = {
  statusCode: GAME_STATUS.MAIN_MENU,
  gameStarted: false,
  menuOptions: [
    { value: GAME_STATUS.CHARACTER_SCREEN, label: 'New Game' },
    { value: GAME_STATUS.SAVE_GAME, label: 'Save Game' },
    { value: GAME_STATUS.LOAD_GAME, label: 'Load Game' },
    { value: GAME_STATUS.ABOUT, label: 'About' },
    { value: GAME_STATUS.HIGH_SCORE, label: 'High score' },
  ],
  fightStarted: false,
  playerHasWon: false,
  currentUser: {},
};

export default function game(state = initialState, action: ActionType) {
  switch (action.type) {
    case SET_STATUS_CODE:
      return {
        ...state,
        statusCode: action.payload,
      };
    case START_GAME:
      return {
        ...state,
        gameStarted: true,
        menuOptions: state.menuOptions.map((el, index) => {
          if (index === 0) {
            return {
              value: GAME_STATUS.CHARACTER_SCREEN,
              label: 'Resume',
            };
          } else {
            return el;
          }
        }),
      };
    case START_FIGHT:
      return {
        ...state,
        fightStarted: true,
      };
    default:
      return state;
  }
}
