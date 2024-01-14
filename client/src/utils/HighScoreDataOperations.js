import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';

const highScoreRef = collection(db, 'high-score');

function sortTopTenData(data) {
  return data
    .sort((a, b) => a.level - b.level)
    .reverse()
    .slice(0, 10);
}

export async function getHighScoreData() {
  try {
    const data = await getDocs(highScoreRef);
    const highScoreData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return sortTopTenData(highScoreData);
  } catch (error) {
    console.log(error);
  }
}

export default function setHighScore(data) {
  const highScoreRef = collection(db, 'high-score');
  const gameData = data;
  gameData.date = new Date().toLocaleDateString('en-GB');
  addDoc(highScoreRef, gameData);
}
