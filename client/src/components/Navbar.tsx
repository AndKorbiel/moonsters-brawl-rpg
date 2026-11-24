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
import { colors, px } from '../theme/tokens';

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
          borderLeft: `${px()} solid ${colors.goldDark}`,
          borderRight: `${px()} solid ${colors.goldMid}`,
          px: px(5),
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
        <Toolbar sx={{ minHeight: px(32), px: px(12), gap: px(4) }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: 28 }}
          >
            Moonster Brawl RPG
          </Typography>

          {status !== GAME_STATUS.FIGHT_SCREEN && (
            <>
              <Button
                color="inherit"
                sx={{ minWidth: px(56), minHeight: px(24), fontSize: 28 }}
                onClick={() => dispatch(setStatusCode(GAME_STATUS.MAIN_MENU))}
              >
                MENU
              </Button>
              {currentUser?.email ? (
                CurrentUserInfoLabel
              ) : (
                <Button
                  color="inherit"
                  sx={{ minWidth: px(56), minHeight: px(24), fontSize: 28 }}
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
