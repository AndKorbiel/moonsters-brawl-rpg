import type { ActionType, CharacterState } from '../../types';
import {
  HANDLE_EDIT_MODE,
  SET_NEW_NAME,
  CHANGE_STATS,
  BUY_ITEM,
  DROP_ITEM,
  CALCULATE_STATS_FROM_ITEM,
} from '../constants/character';

const initialState: CharacterState = {
  name: 'Moonster',
  image: 'assets/images/frank.png',
  level: 1,
  points: 5,
  stats: [
    { name: 'attack', value: 10 },
    { name: 'defense', value: 10 },
    { name: 'life', value: 20 },
  ],
  gold: 20,
  items: [],
  isEditing: false,
};

export default function character(state = initialState, action: ActionType) {
  switch (action.type) {
    case HANDLE_EDIT_MODE:
      return {
        ...state,
        isEditing: action.payload,
      };
    case SET_NEW_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case CHANGE_STATS:
      return {
        ...state,
        stats: action.payload.stats,
        points: action.payload.points,
        level: action.payload.level,
        gold: action.payload.gold,
      };
    case BUY_ITEM:
      if (
        state.gold < action.payload.price ||
        state.items.some((item) => item.type === action.payload.type)
      ) {
        return state;
      }
      return {
        ...state,
        gold: state.gold - action.payload.price,
        items: [...state.items, action.payload],
      };
    case CALCULATE_STATS_FROM_ITEM:
      if (action.payload.length === 0) return state;
      return {
        ...state,
        stats: state.stats.map((stat) => {
          const valueToAdd = action.payload
            .filter((itemStat) => itemStat.name === stat.name)
            .reduce((total, itemStat) => total + itemStat.value, 0);
          return valueToAdd === 0
            ? stat
            : { ...stat, value: stat.value + valueToAdd };
        }),
      };
    case DROP_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    default:
      return state;
  }
}
