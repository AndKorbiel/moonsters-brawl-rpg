import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase-config';

export default function setHighScore(data) {
    const highScoreRef = collection(db, 'high-score');
    const gameData = data;
    gameData.date = new Date().toLocaleDateString("en-GB");
    addDoc(highScoreRef, gameData);
}