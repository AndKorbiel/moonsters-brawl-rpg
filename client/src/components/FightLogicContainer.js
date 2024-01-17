import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { setStatusCode } from '../redux/actions/game';
import { GAME_OVER } from '../redux/types/game';
import { changeStats } from '../redux/actions/character';
import { levelUp, resetStats } from '../redux/actions/opponent';

import setHighScore from '../utils/HighScoreDataOperations';
import { calculateFightStats, calculateLevelUp } from '../utils/FightMath';

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

  const [state, setState] = useState(iniitialState);
  const [gameIsReady, setGameIsReady] = useState(false);
  const [isFightOver, setIsFightIsOver] = useState(false);

  const handleGameStart = useCallback(() => {
    return setTimeout(() => {
      if (!isFightOver) {
        if (
          state.hero.stats.filter((el) => el.name === 'life')[0].value > 0 &&
          state.opponent.stats.filter((el) => el.name === 'life')[0].value > 0
        ) {
          const results = calculateFightStats(state);

          setState((state) => ({
            ...state,
            activePlayer: !state.activePlayer,
            hero: results.hero,
            opponent: results.opponent,
            logger: results.logger,
          }));
        } else {
          let fightWon = false;
          let message = '';
          setIsFightIsOver(true);

          if (!state.activePlayer) {
            fightWon = true;
            message = 'You have won';
          } else {
            message = 'You have lost!';
          }
          let logger = state.logger;
          logger.push(message);

          setState({
            ...state,
            logger: logger,
            isFighting: false,
            fightWon: fightWon,
          });
        }
      }
    }, 300);
  }, [state]);

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

  const getLifePoints = (player) => {
    if (player) {
      return player.stats.filter((el) => el.name === 'life')[0].value;
    }
  };

  const handleFightOverState = () => {
    if (state.fightWon) {
      const calculateStats = calculateLevelUp({ character, opponent });

      dispatch(changeStats(calculateStats.currentStats));
      dispatch(setStatusCode(1));
      dispatch(levelUp(calculateStats.opponent));
    } else {
      dispatch({ type: GAME_OVER });
      setHighScore(character);
      dispatch(
        resetStats([
          { name: 'attack', value: 10 },
          { name: 'defense', value: 10 },
          { name: 'life', value: 10 },
        ]),
      );
    }

    setIsFightIsOver(false);
    setGameIsReady(false);
    setState({ ...iniitialState });
  };

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
