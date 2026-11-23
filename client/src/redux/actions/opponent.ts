import type { ActionType, OpponentProps, OpponentState } from '../../types';
import {
  LEVEL_UP,
  RESET_STATS,
  SET_OPPONENT,
} from '../constants/opponent';

export function levelUp(stats: OpponentProps) {
  return {
    type: LEVEL_UP,
    payload: stats,
  } satisfies ActionType;
}

export function resetStats(stats: OpponentProps['stats']) {
  return {
    type: RESET_STATS,
    payload: stats,
  } satisfies ActionType;
}

export function setOpponent(opponent: OpponentState) {
  return {
    type: SET_OPPONENT,
    payload: opponent,
  } satisfies ActionType;
}
