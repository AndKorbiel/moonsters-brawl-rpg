import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { db } from '../../firebase-config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

import { getSavedGamesEffect } from '../../redux/effects/user';
import { LoadGame } from './LoadGame';

const gameCollectionRef = collection(db, 'games');

export function SaveGame() {
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      game: state.game,
      userEmail: state.user.currentUser ? state.user.currentUser.email : null,
      opponent: state.opponent,
      shop: state.shop,
      character: state.character,
    };
  });

  const startDate = new Date().toLocaleDateString('en-GB');
  const [successNotification, setSuccesNotification] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSetStatus = () => {
    setSuccesNotification(true);
    dispatch(getSavedGamesEffect(currentUser.email));

    setTimeout(() => {
      setSuccesNotification(false);
    }, 2000);
  };

  const saveGame = async () => {
    await addDoc(gameCollectionRef, { ...state, date: startDate });
    handleSetStatus();
  };

  const handleOverwriteGame = async (id) => {
    const gameDoc = doc(db, 'games', id);
    await updateDoc(gameDoc, state);
    handleSetStatus();
  };

  // useEffect(() => {
  //   currentUser && dispatch(getSavedGamesEffect(currentUser.email));
  // }, []);

  return (
    <Box maxWidth="xl" className="centered text-centered save">
      <Card className="padlr">
        <h1>Save your game</h1>

        {currentUser?.email ? (
          <>
            {successNotification && (
              <Alert severity="success">Game saved</Alert>
            )}

            <LoadGame mode="save" action={handleOverwriteGame} />

            <Button variant="contained" color="secondary" onClick={saveGame}>
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
