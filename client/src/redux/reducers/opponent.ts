import type { ActionType, OpponentState } from '../../types';
import {
  LEVEL_UP,
  RESET_STATS,
  SET_NAME,
  SET_IMAGE,
} from '../constants/opponent';

const initialState: OpponentState = {
  name: '',
  level: 1,
  image: 'assets/images/Mons1.png',
  points: 0,
  stats: [
    { name: 'attack', value: 10 },
    { name: 'defense', value: 10 },
    { name: 'life', value: 10 },
  ],
  isReady: false,
};

export default function opponent(state = initialState, action: ActionType) {
  switch (action.type) {
    case LEVEL_UP:
      return {
        ...state,
        level: action.payload.level,
        points: action.payload.points,
        stats: action.payload.stats,
        isReady: false,
      };
    case RESET_STATS:
      return {
        ...state,
        stats: action.payload,
      };
    case SET_NAME:
      return {
        ...state,
        name: action.payload,
        isReady: true,
      };
    case SET_IMAGE:
      return {
        ...state,
        image: `assets/images/Mons${action.payload}.png`,
      };
    default:
      return state;
  }
}
