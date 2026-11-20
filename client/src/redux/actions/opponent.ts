import type { ActionType, OpponentProps } from '../../types';
import {
  LEVEL_UP,
  RESET_STATS,
  SET_NAME,
  SET_IMAGE,
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

export function setName(name: string) {
  return {
    type: SET_NAME,
    payload: name,
  } satisfies ActionType;
}

export function setImage(imageNumber: number) {
  return {
    type: SET_IMAGE,
    payload: imageNumber,
  } satisfies ActionType;
}
