import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { db } from '../../firebase-db';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

import { getSavedGamesEffect } from '../../redux/effects/user';
import { setSavedGames } from '../../redux/actions/user';
import { LoadGame } from './LoadGame';
import { AppState } from '../../types';

const gameCollectionRef = collection(db, 'games');

export function SaveGame() {
  const dispatch = useDispatch();
  const state = useSelector((state: AppState) => {
    return {
      game: state.game,
      userEmail: state.user.currentUser ? state.user.currentUser.email : null,
      opponent: state.opponent,
      shop: state.shop,
      character: state.character,
    };
  });

  const [successNotification, setSuccessNotification] = useState(false);
  const [errorNotification, setErrorNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!successNotification) return;

    const timeout = setTimeout(() => setSuccessNotification(false), 2000);
    return () => clearTimeout(timeout);
  }, [successNotification]);

  const saveGame = async () => {
    setIsSaving(true);
    setSuccessNotification(false);
    setErrorNotification(false);

    try {
      await addDoc(gameCollectionRef, {
        ...state,
        date: new Date().toLocaleDateString('en-GB'),
      });
      if (state.userEmail) {
        const savedGames = await getSavedGamesEffect(state.userEmail);
        dispatch(setSavedGames(savedGames));
      }
      setSuccessNotification(true);
    } catch (error) {
      console.error('Failed to save game', error);
      setErrorNotification(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverwriteGame = async (id: string) => {
    setIsSaving(true);
    setSuccessNotification(false);
    setErrorNotification(false);

    try {
      const gameDoc = doc(db, 'games', id);
      await updateDoc(gameDoc, {
        ...state,
        date: new Date().toLocaleDateString('en-GB'),
      });
      if (state.userEmail) {
        const savedGames = await getSavedGamesEffect(state.userEmail);
        dispatch(setSavedGames(savedGames));
      }
      setSuccessNotification(true);
    } catch (error) {
      console.error('Failed to overwrite saved game', error);
      setErrorNotification(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1536 }} className="centered text-centered save">
      <Card className="padlr">
        <h1>Save your game</h1>

        {state.userEmail ? (
          <>
            {successNotification && (
              <Alert severity="success">Game saved</Alert>
            )}
            {errorNotification && (
              <Alert severity="error">
                Unable to save game. Please try again.
              </Alert>
            )}

            <LoadGame
              mode="save"
              action={handleOverwriteGame}
              actionLoading={isSaving}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={saveGame}
              disabled={isSaving}
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
