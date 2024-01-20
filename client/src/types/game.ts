import { CharacterState } from './character';

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

export type SavedGame = GameState & {
  character: CharacterState;
  game: GameState & { id: string };
  date: string;
  userEmail: string;
};
