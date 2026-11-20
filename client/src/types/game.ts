import { CharacterState } from './character';
import { OpponentState } from './opponent';
import { ShopState } from './shop';

export type MenuOption = {
  label: string;
  value: number;
};

export type GameState = {
  statusCode: number;
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
  shop: ShopState;
  date: string;
  userId: string;
};
