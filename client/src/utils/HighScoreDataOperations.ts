import {
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase-db';
import type { CharacterState, HighScoreData, HighScoreRecord } from '../types';

const highScoreRef = collection(db, 'high-score');

function sortTopTenData(data: HighScoreData[]): HighScoreData[] {
  return [...data]
    .sort((a, b) => a.level - b.level)
    .reverse()
    .slice(0, 10);
}

export async function getHighScoreData(): Promise<HighScoreData[]> {
  const data = await getDocs(highScoreRef);
  const highScoreData: HighScoreData[] = data.docs.map((highScoreDoc) => ({
    ...(highScoreDoc.data() as HighScoreRecord),
    id: highScoreDoc.id,
  }));

  return sortTopTenData(highScoreData);
}

export default async function setHighScore(
  data: CharacterState,
): Promise<void> {
  const gameData: HighScoreRecord = {
    ...data,
    date: new Date().toLocaleDateString('en-GB'),
  };
  await addDoc(highScoreRef, gameData);
}
