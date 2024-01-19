import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { setSavedGames } from '../actions/user';
import type { Dispatch } from 'redux';

const gameCollectionRef = collection(db, 'games');

export const getSavedGamesEffect = (curentUserEmail: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const data = await getDocs(gameCollectionRef);

      const savedGames = data.docs
        .map((doc) => ({
          ...doc.data(),
          game: {
            ...doc.data().game,
            id: doc.id,
          },
        }))
        .filter((doc: any) => doc.userEmail === curentUserEmail);

      dispatch(setSavedGames(savedGames));
    } catch (error) {
      console.log(error);
    }
  };
};
