import type { ActionType, GameState } from '../../types';
import { SET_STATUS_CODE, START_GAME, START_FIGHT } from '../constants/game';

const initialState: GameState = {
  statusCode: 0,
  gameStarted: false,
  menuOptions: [
    { value: 1, label: 'New Game' },
    { value: 5, label: 'Save Game' },
    { value: 6, label: 'Load Game' },
    { value: 7, label: 'About' },
    { value: 8, label: 'High score' },
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
            return { value: 1, label: 'Resume' };
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
