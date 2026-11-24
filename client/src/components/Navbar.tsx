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
import { buttonStates, colors, px } from '../theme/tokens';

export function Navbar({ status }: { status: GameStatusCode }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.user.currentUser);
  const isMainMenu = status === GAME_STATUS.MAIN_MENU;

  const navButtonSx = {
    width: px(44),
    minWidth: px(44),
    minHeight: px(16),
    height: px(16),
    fontSize: 16,
    flexShrink: 0,
  };

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
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        Logged in as: {currentUser?.email}
      </Typography>
      <Button
        color="inherit"
        sx={navButtonSx}
        onClick={() => signOut(auth)}
      >
        Logout
      </Button>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar
          sx={{
            minHeight: px(20),
            px: { xs: px(2), sm: px(12) },
            gap: { xs: px(3), sm: px(4) },
            '&.MuiToolbar-root': { minHeight: px(20) },
          }}
        >
          <Box
            component="img"
            src="/assets/images/frank.png"
            alt=""
            aria-hidden="true"
            sx={{
              display: { xs: 'none', sm: 'block' },
              width: px(14),
              height: px(14),
              objectFit: 'contain',
              imageRendering: 'pixelated',
              flexShrink: 0,
            }}
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              fontSize: { xs: 16, sm: 24 },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Moonster Brawl RPG
          </Typography>

          {status !== GAME_STATUS.FIGHT_SCREEN && (
            <>
              <Box
                component="span"
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  flexShrink: 0,
                  ...(isMainMenu && {
                    pb: px(),
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: px(3),
                      right: px(3),
                      bottom: 0,
                      height: px(),
                      backgroundColor: colors.ember,
                      pointerEvents: 'none',
                    },
                  }),
                }}
              >
                <Button
                  color="inherit"
                  sx={{
                    ...navButtonSx,
                    ...(isMainMenu && {
                      backgroundColor: buttonStates.stone.hover.face,
                      color: buttonStates.stone.hover.text,
                      boxShadow: `inset ${px()} ${px()} 0 ${buttonStates.stone.hover.hi}, inset -${px()} -${px()} 0 ${buttonStates.stone.hover.sh}`,
                    }),
                  }}
                  onClick={() =>
                    dispatch(setStatusCode(GAME_STATUS.MAIN_MENU))
                  }
                >
                  MENU
                </Button>
              </Box>
              {currentUser?.email ? (
                CurrentUserInfoLabel
              ) : (
                <Button
                  color="inherit"
                  sx={navButtonSx}
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
