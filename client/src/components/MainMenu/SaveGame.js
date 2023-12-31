import { useSelector } from 'react-redux';
import { db } from '../../firebase-config';
import { collection, addDoc } from 'firebase/firestore'

export default function SaveGame() {
  const state = useSelector(state => state);
  const gameCollectionRef = collection(db, 'games');
  state.date = new Date().toLocaleDateString("en-GB")
  const saveGame = async () => {
    await addDoc(gameCollectionRef, state)
  }
  return (
    <div>
      <h1>Save your game</h1>
      <button onClick={() => saveGame()}>Save your game</button>
    </div>
  )
}