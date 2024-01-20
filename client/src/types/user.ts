import { SavedGame } from './game';

export type UserState = {
  currentUser: {
    email: string;
    uid: string;
  } | null;
  savedGames: SavedGame[] | null;
};
