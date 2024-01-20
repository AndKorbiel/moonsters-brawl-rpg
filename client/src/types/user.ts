export type UserState = {
  currentUser: {
    email: string;
    uid: string;
  } | null;
  savedGames: {};
};
