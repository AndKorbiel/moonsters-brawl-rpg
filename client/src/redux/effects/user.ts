import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

const gameCollectionRef = collection(db, 'games');

export const getSavedGamesEffect = async (curentUserEmail: string) => {
  try {
    const data = await getDocs(gameCollectionRef);
    const savedGames = data.docs
      .map((doc: any) => ({
        ...doc.data(),
        game: {
          ...doc.data().game,
          id: doc.id,
        },
      }))
      .filter((doc: any) => doc.userEmail === curentUserEmail);

    return savedGames;
  } catch (error) {
    console.log(error);
    return [];
  }
};
