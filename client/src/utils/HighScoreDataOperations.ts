import {
  collection,
  addDoc,
  getDocs,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { CharacterState, HighScoreData } from '../types';

const highScoreRef = collection(db, 'high-score');

function sortTopTenData(data: HighScoreData[]) {
  return data
    .sort((a, b) => a.level - b.level)
    .reverse()
    .slice(0, 10);
}

export async function getHighScoreData() {
  try {
    const data = await getDocs(highScoreRef);
    const highScoreData: HighScoreData[] = data.docs.map(
      (doc: QueryDocumentSnapshot<HighScoreData, HighScoreData>) => ({
        ...doc.data(),
        id: doc.id,
      }),
    );

    return sortTopTenData(highScoreData);
  } catch (error) {
    console.log(error);
  }
}

export default function setHighScore(data: CharacterState) {
  const highScoreRef = collection(db, 'high-score');
  const gameData: Partial<HighScoreData> = data;
  gameData.date = new Date().toLocaleDateString('en-GB');
  addDoc(highScoreRef, gameData);
}
