import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../firebase-db';
import { deleteDoc, doc } from 'firebase/firestore';
import { loadGame, setStatusCode } from '../../redux/actions/game';
import { getSavedGamesEffect } from '../../redux/effects/user';
import { AppState } from '../../types';
import { setSavedGames } from '../../redux/actions/user';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';

type LoadGameProps = {
  mode?: string;
  action?: (id: string) => Promise<void>;
  actionLoading?: boolean;
};

export function LoadGame({ mode, action, actionLoading }: LoadGameProps) {
  const dispatch = useDispatch();
  const { currentUser, savedGames } = useSelector((state: AppState) => ({
    currentUser: state.user.currentUser,
    savedGames: state.user.savedGames,
  }));

  const [successNotification, setSuccesNotification] = useState(false);
  const currentUserId = currentUser?.uid;

  const handleLoadGame = (savedGame) => {
    dispatch(loadGame(savedGame));
    dispatch(setStatusCode(1));
  };

  const handleSetStatus = () => {
    setSuccesNotification(true);
    setTimeout(() => {
      setSuccesNotification(false);
    }, 2000);
  };

  const deleteSavedGame = async (id: string) => {
    const gameDoc = doc(db, 'games', id);
    await deleteDoc(gameDoc);
    handleSetStatus();
    if (currentUserId) {
      const savedGames = await getSavedGamesEffect(currentUserId);
      dispatch(setSavedGames(savedGames));
    }
  };

  useEffect(() => {
    let active = true;

    if (!currentUserId) {
      dispatch(setSavedGames([]));
      return;
    }

    getSavedGamesEffect(currentUserId).then((games) => {
      if (active) dispatch(setSavedGames(games));
    });

    return () => {
      active = false;
    };
  }, [currentUserId, dispatch]);

  return (
    <Box sx={{ maxWidth: 1536 }} className="centered text-centered menu-table">
      <Card className="padlr">
        {mode !== 'save' && <h1>Load game</h1>}

        {successNotification && <Alert severity="warning">Game deleted</Alert>}

        {currentUser?.email ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Character name</TableCell>
                  <TableCell>Character Level</TableCell>
                  <TableCell>Character gold</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedGames?.length > 0 &&
                  savedGames.map((savedGame) => {
                    return (
                      <TableRow key={savedGame.game.id}>
                        <TableCell>{savedGame.character.name}</TableCell>
                        <TableCell>{savedGame.character.level}</TableCell>
                        <TableCell>{savedGame.character.gold}</TableCell>
                        <TableCell>{savedGame.date}</TableCell>
                        <TableCell>
                          {mode === 'save' ? (
                            <Button
                              variant="contained"
                              disabled={!action || actionLoading}
                              onClick={() => action?.(savedGame.game.id)}
                            >
                              Overwrite game
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="contained"
                                onClick={() => handleLoadGame(savedGame)}
                              >
                                Load game
                              </Button>

                              <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  deleteSavedGame(savedGame.game.id)
                                }
                              >
                                Delete game
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="error">You have to be logged in to load game</Alert>
        )}
      </Card>
    </Box>
  );
}
