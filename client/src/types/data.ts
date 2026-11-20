import type {
  CharacterProps,
  CharacterStat,
  CharacterState,
} from './character';
import type { Item, ShopState } from './shop';
import type { GameState, SavedGame } from './game';
import type { OpponentProps, OpponentState } from './opponent';
import type { UserState } from './user';
import {
  BUY_ITEM,
  CALCULATE_STATS_FROM_ITEM,
  CHANGE_STATS,
  DROP_ITEM,
  HANDLE_EDIT_MODE,
  SET_NEW_NAME,
} from '../redux/constants/character';
import {
  GAME_OVER,
  LOAD_GAME,
  SET_STATUS_CODE,
  START_FIGHT,
  START_GAME,
} from '../redux/constants/game';
import {
  LEVEL_UP,
  RESET_STATS,
  SET_OPPONENT,
} from '../redux/constants/opponent';
import { REMOVE_FROM_SHOP } from '../redux/constants/shop';
import { SET_CURRENT_USER, SET_SAVED_GAMES } from '../redux/constants/user';

type EmptyAction<T extends string> = { type: T };
type PayloadAction<T extends string, P> = { type: T; payload: P };

export type ActionType =
  | PayloadAction<typeof SET_STATUS_CODE, number>
  | EmptyAction<typeof START_GAME>
  | EmptyAction<typeof START_FIGHT>
  | EmptyAction<typeof GAME_OVER>
  | PayloadAction<typeof LOAD_GAME, SavedGame>
  | PayloadAction<typeof HANDLE_EDIT_MODE, boolean>
  | PayloadAction<typeof SET_NEW_NAME, string>
  | PayloadAction<typeof CHANGE_STATS, CharacterProps>
  | PayloadAction<typeof BUY_ITEM, Item>
  | PayloadAction<typeof DROP_ITEM, Item>
  | PayloadAction<typeof CALCULATE_STATS_FROM_ITEM, CharacterStat[]>
  | PayloadAction<typeof LEVEL_UP, OpponentProps>
  | PayloadAction<typeof RESET_STATS, CharacterStat[]>
  | PayloadAction<typeof SET_OPPONENT, OpponentState>
  | PayloadAction<typeof REMOVE_FROM_SHOP, Item>
  | PayloadAction<typeof SET_CURRENT_USER, UserState['currentUser']>
  | PayloadAction<typeof SET_SAVED_GAMES, SavedGame[]>;

export type AppState = {
  character: CharacterState;
  game: GameState;
  opponent: OpponentState;
  shop: ShopState;
  user: UserState;
};

export type HighScoreRecord = CharacterState & {
  date: string;
};

export type HighScoreData = HighScoreRecord & {
  id: string;
};
