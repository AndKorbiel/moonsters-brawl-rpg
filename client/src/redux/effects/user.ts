import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase-db';
import { GameState, SavedGame } from '../../types';

const gameCollectionRef = collection(db, 'games');
type StoredSavedGame = Omit<SavedGame, 'game'> & {
  game: GameState;
};

export const getSavedGamesEffect = async (userId: string) => {
  try {
    const data = await getDocs(
      query(gameCollectionRef, where('userId', '==', userId)),
    );
    const savedGames: SavedGame[] = data.docs.map((savedDoc) => {
      const savedData = savedDoc.data() as StoredSavedGame;
      return {
        ...savedData,
        game: {
          ...savedData.game,
          id: savedDoc.id,
        },
      };
    });

    return savedGames;
  } catch (error) {
    console.error('Failed to retrieve saved games', error);
    return [];
  }
};
