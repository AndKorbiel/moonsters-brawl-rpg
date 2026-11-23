import { CharacterState } from './character';
import { OpponentState } from './opponent';
import { PersistedShopState } from './shop';
import type { GameStatusCode } from '../redux/constants/game';

export type MenuOption = {
  label: string;
  value: GameStatusCode;
};

export type GameState = {
  statusCode: GameStatusCode;
  gameStarted: boolean;
  menuOptions: MenuOption[];
  fightStarted: boolean;
  playerHasWon: boolean;
  currentUser: {};
};

export type SavedGame = {
  game: GameState & { id: string };
  character: CharacterState;
  opponent: OpponentState;
  shop: PersistedShopState;
  date: string;
  userId: string;
};
