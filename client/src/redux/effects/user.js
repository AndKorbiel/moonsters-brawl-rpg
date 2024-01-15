import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { setSavedGames } from '../actions/user';

const gameCollectionRef = collection(db, 'games');

export const getSavedGamesEffect = (curentUser) => {
  return async (dispatch) => {
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
        .filter((doc) => doc.userEmail === curentUser);

      dispatch(setSavedGames(savedGames));
    } catch (error) {
      console.log(error);
    }
  };
};
