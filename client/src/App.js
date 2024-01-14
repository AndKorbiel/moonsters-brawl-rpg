import './styles/App.scss';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { setStatusCode } from './redux/actions/game';
import { START_GAME } from './redux/types/game';

import { FightScreenCard, MainMenu, OpponentCard, ShopCard } from './modules/';
import CharacterCard from './modules/CharacterCard';
import {
  About,
  HighScore,
  LoadGame,
  Login,
  Navbar,
  SaveGame,
} from './components';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c0f23',
    },
    secondary: {
      main: '#fe7800',
    },
  },
});

const App = (props) => {
  const dispatch = useDispatch();

  const handleGameStatus = (status) => {
    if (status === 1) dispatch({ type: START_GAME });

    dispatch(setStatusCode(status));
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar status={props.statusCode} action={handleGameStatus} />

      <div className="App">
        <Grid
          container
          maxWidth="xl"
          spacing={2}
          className="main-cont centered"
        >
          {props.statusCode === 0 && (
            <Grid item xs={12}>
              <MainMenu
                action={handleGameStatus}
                gameStarted={props.gameStarted}
                options={props.menuOptions}
              />
            </Grid>
          )}

          {props.statusCode === 1 && (
            <>
              <Grid item xs={12} md={4} lg={3}>
                <CharacterCard />
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <ShopCard />
              </Grid>
            </>
          )}

          {props.statusCode === 2 && (
            <>
              <Grid item xs={12} md={4} lg={3}>
                <CharacterCard />
              </Grid>
              <Grid item xs={12} md={4} lg={6}>
                <FightScreenCard />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <OpponentCard />
              </Grid>
            </>
          )}

          {props.statusCode === 5 && <SaveGame />}
          {props.statusCode === 6 && <LoadGame />}
          {props.statusCode === 7 && <About />}
          {props.statusCode === 8 && <HighScore />}
          {props.statusCode === 9 && <Login />}
        </Grid>
      </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    statusCode: state.game.statusCode,
    gameStarted: state.game.gameStarted,
    menuOptions: state.game.menuOptions,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setStatusCode: (statusCode) => {
//       dispatch(setStatusCode(statusCode));
//     },
//     startGame: () => {
//       dispatch({ type: START_GAME });
//     },
//   };
// };

export default connect(mapStateToProps, null)(App);
