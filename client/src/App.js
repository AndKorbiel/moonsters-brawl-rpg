import './styles/App.scss';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { START_GAME } from './redux/constants/game';

import { FightScreenCard, MainMenu, OpponentCard, ShopCard } from './modules/';
import { CharacterCardContainer } from './modules/CharacterCard';
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

export default function App() {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);
  const { menuOptions, statusCode } = game;

  useEffect(() => {
    if (statusCode === 1) dispatch({ type: START_GAME });
  }, [dispatch, statusCode]);

  if (!menuOptions) return <h1>Loading...</h1>;

  return (
    <ThemeProvider theme={theme}>
      <Navbar status={statusCode} />

      <div className="App">
        <Grid
          container
          maxWidth="xl"
          spacing={2}
          className="main-cont centered"
        >
          {statusCode === 0 && (
            <Grid item xs={12}>
              <MainMenu options={menuOptions} />
            </Grid>
          )}

          {statusCode === 1 && (
            <>
              <Grid item xs={12} md={4} lg={3}>
                <CharacterCardContainer />
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <ShopCard />
              </Grid>
            </>
          )}

          {statusCode === 2 && (
            <>
              <Grid item xs={12} md={4} lg={3}>
                <CharacterCardContainer />
              </Grid>
              <Grid item xs={12} md={4} lg={6}>
                <FightScreenCard />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <OpponentCard />
              </Grid>
            </>
          )}

          {statusCode === 5 && <SaveGame />}
          {statusCode === 6 && <LoadGame />}
          {statusCode === 7 && <About />}
          {statusCode === 8 && <HighScore />}
          {statusCode === 9 && <Login />}
        </Grid>
      </div>
    </ThemeProvider>
  );
}
