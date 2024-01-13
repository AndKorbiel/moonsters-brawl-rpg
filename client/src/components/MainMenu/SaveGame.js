import { useState } from 'react';
import { useSelector } from 'react-redux';

import { db } from '../../firebase-config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

import { LoadGame } from './LoadGame';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export function SaveGame() {
  const state = useSelector((state) => {
    return {
      game: state.game,
      user: state.user.currentUser ? state.user.currentUser.email : null,
      opponent: state.opponent,
      shop: state.shop,
      character: state.character,
    };
  });

  const gameCollectionRef = collection(db, 'games');
  state.date = new Date().toLocaleDateString('en-GB');
  const [status, setStatus] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSetStatus = () => {
    setStatus(true);
    setTimeout(() => {
      setStatus(false);
    }, 2000);
  };

  const saveGame = async () => {
    await addDoc(gameCollectionRef, state);
    handleSetStatus();
  };

  const handleOverwriteGame = async (id) => {
    const gameDoc = doc(db, 'games', id);
    await updateDoc(gameDoc, state);
    handleSetStatus();
  };

  return (
    <Box maxWidth="xl" className="centered text-centered save">
      <Card className="padlr">
        <h1>Save your game</h1>

        {currentUser?.email ? (
          <>
            {status ? <Alert severity="success">Game saved</Alert> : ''}
            <LoadGame mode="save" action={handleOverwriteGame} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => saveGame()}
            >
              Save new game
            </Button>
          </>
        ) : (
          <Alert severity="error">You have to be logged in to save game</Alert>
        )}
      </Card>
    </Box>
  );
}
