import { SavedGame } from './game';

export type UserState = {
  currentUser: {
    email: string | null;
    uid: string;
  } | null;
  savedGames: SavedGame[] | null;
};
