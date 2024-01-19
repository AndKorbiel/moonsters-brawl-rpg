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
