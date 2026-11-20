import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { auth } from '../firebase-auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { setCurrentUser } from '../redux/actions/user';
import { setStatusCode } from '../redux/actions/game';
import { GAME_STATUS } from '../redux/constants/game';
import type { AppState } from '../types';
import type { GameStatusCode } from '../redux/constants/game';

export function Navbar({ status }: { status: GameStatusCode }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.user.currentUser);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      dispatch(setCurrentUser(currentUser));
    });
  }, [dispatch]);

  const CurrentUserInfoLabel = (
    <>
      <Typography
        variant="body1"
        sx={{
          borderLeft: '1px solid #d3d3d3',
          borderRight: '1px solid white',
          padding: '0 10px',
        }}
      >
        Logged in as: {currentUser?.email}
      </Typography>
      <Button color="inherit" onClick={() => signOut(auth)}>
        Logout
      </Button>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Moonster Brawl RPG
          </Typography>

          {status !== GAME_STATUS.FIGHT_SCREEN && (
            <>
              <Button
                color="inherit"
                onClick={() => dispatch(setStatusCode(GAME_STATUS.MAIN_MENU))}
              >
                MENU
              </Button>
              {currentUser?.email ? (
                CurrentUserInfoLabel
              ) : (
                <Button
                  color="inherit"
                  onClick={() => dispatch(setStatusCode(GAME_STATUS.LOGIN))}
                >
                  Login
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
