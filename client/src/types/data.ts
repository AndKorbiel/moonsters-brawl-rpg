import {
  CharacterState,
  GameState,
  OpponentState,
  ShopState,
  UserState,
} from './';

export type ActionType = {
  payload: any;
  type: string;
};

export type AppState = {
  character: CharacterState;
  game: GameState;
  opponent: OpponentState;
  shop: ShopState;
  user: UserState;
};
