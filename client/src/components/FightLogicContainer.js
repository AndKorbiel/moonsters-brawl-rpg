import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useGameOver, useGameStart } from '../hooks';

export const FightLogicContainer = () => {
  const dispatch = useDispatch();
  const { character, opponent, opponentIsReaady } = useSelector((state) => ({
    character: state.character,
    opponent: state.opponent,
    opponentIsReaady: state.opponent.isReady,
  }));

  const iniitialState = {
    hero: false,
    opponent: false,
    heroIsStarting: false,
    activePlayer: 0,
    isFighting: true,
    logger: [],
    previousOpponent: '',
  };

  const getLifePoints = (player) => {
    if (player) {
      return player.stats.filter((el) => el.name === 'life')[0].value;
    }
  };

  const [state, setState] = useState(iniitialState);
  const [gameIsReady, setGameIsReady] = useState(false);
  const [isFightOver, setIsFightIsOver] = useState(false);

  const { handleGameStart } = useGameStart(
    state,
    isFightOver,
    setState,
    setIsFightIsOver,
  );

  const { handleFightOverState } = useGameOver(
    state,
    setState,
    setGameIsReady,
    setIsFightIsOver,
    iniitialState,
  );

  useEffect(() => {
    if (opponentIsReaady) {
      setGameIsReady(true);
      const starting = Math.round(Math.random());

      setState({
        ...state,
        hero: { ...character },
        opponent: { ...opponent },
        heroIsStarting: starting,
        activePlayer: starting ? true : false,
      });
    }
  }, [character, opponent, opponentIsReaady]);

  useEffect(() => {
    if (gameIsReady) {
      handleGameStart();
    }
  }, [handleGameStart, gameIsReady]);

  if (!gameIsReady) return <h1>Loading...</h1>;

  return (
    <Grid container maxWidth="xl" spacing={2} className="centered">
      <Grid item xs={6}>
        <p>
          <b>Your life points: {getLifePoints(state.hero)}</b>
        </p>
      </Grid>
      <Grid item xs={6}>
        <p>
          <b>Your opponent life points: {getLifePoints(state.opponent)}</b>
        </p>
      </Grid>
      <Grid item xs={12}>
        {state.heroIsStarting === 1 ? state.hero.name : state.opponent.name}{' '}
        will attack first.
        {state.logger.map((el, index) => {
          return <p key={index}>{el}</p>;
        })}
        {!state.isFighting && (
          <Button
            variant="contained"
            color="error"
            onClick={handleFightOverState}
          >
            Continue
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
