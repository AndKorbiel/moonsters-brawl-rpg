import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { auth } from '../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { setCurrentUser } from '../redux/actions/user';
import { setStatusCode } from '../redux/actions/game';
import { AppState } from '../types';

export function Navbar({ status }: { status: number }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.user.currentUser);

  onAuthStateChanged(auth, (currentUser) => {
    dispatch(setCurrentUser(currentUser));
  });

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

          {status !== 2 && (
            <>
              <Button
                color="inherit"
                onClick={() => dispatch(setStatusCode(0))}
              >
                MENU
              </Button>
              {currentUser?.email ? (
                CurrentUserInfoLabel
              ) : (
                <Button
                  color="inherit"
                  onClick={() => dispatch(setStatusCode(9))}
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
