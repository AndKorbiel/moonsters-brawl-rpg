import { CharacterProps, Item } from '../../types';
import {
  HANDLE_EDIT_MODE,
  SET_NEW_NAME,
  CHANGE_STATS,
  BUY_ITEM,
  DROP_ITEM,
  CALCULATE_STATS_FROM_ITEM,
} from '../constants/character';

export function handleEditMode(value: boolean) {
  return {
    type: HANDLE_EDIT_MODE,
    payload: value,
  };
}

export function setNewName(newName: string) {
  return {
    type: SET_NEW_NAME,
    payload: newName,
  };
}

export function changeStats(value: CharacterProps) {
  return {
    type: CHANGE_STATS,
    payload: value,
  };
}

export function buyItem(item: Item) {
  return {
    type: BUY_ITEM,
    payload: item,
  };
}

export function calculateStatsFromItem(item: Item['stats']) {
  return {
    type: CALCULATE_STATS_FROM_ITEM,
    payload: item,
  };
}

export function dropItem(item: Item) {
  return {
    type: DROP_ITEM,
    payload: item,
  };
}
