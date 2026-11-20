export const GAME_STATUS = {
  MAIN_MENU: 0,
  CHARACTER_SCREEN: 1,
  FIGHT_SCREEN: 2,
  SAVE_GAME: 5,
  LOAD_GAME: 6,
  ABOUT: 7,
  HIGH_SCORE: 8,
  LOGIN: 9,
} as const;

export type GameStatusCode = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export const SET_STATUS_CODE = 'SET_STATUS_CODE';
export const START_GAME = 'START_GAME';
export const START_FIGHT = 'START_FIGHT';
export const GAME_OVER = 'GAME_OVER';
export const LOAD_GAME = 'LOAD_GAME';
