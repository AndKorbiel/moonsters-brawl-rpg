import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useGameOver, useGameStart } from '../hooks';
import { AppState, CharacterState, OpponentState } from '../types';

export type LocalFightLogicState = {
  fightWon: boolean;
  hero: CharacterState | null;
  opponent: OpponentState | null;
  heroIsStarting: number;
  activePlayer: boolean;
  isFighting: boolean;
  logger: string[];
  previousOpponent: string;
};

export const FightLogicContainer = () => {
  const { character, opponent, opponentIsReaady } = useSelector(
    (state: AppState) => ({
      character: state.character,
      opponent: state.opponent,
      opponentIsReaady: state.opponent.isReady,
    }),
  );

  const iniitialState: LocalFightLogicState = {
    fightWon: false,
    hero: null,
    opponent: null,
    heroIsStarting: 0,
    activePlayer: false,
    isFighting: true,
    logger: [],
    previousOpponent: '',
  };

  const getLifePoints = (player: CharacterState | OpponentState) => {
    if (player) {
      return player.stats.filter((el) => el.name === 'life')[0].value;
    }
  };

  const [localState, setLocalState] = useState(iniitialState);
  const [gameIsReady, setGameIsReady] = useState(false);
  const [isFightOver, setIsFightIsOver] = useState(false);

  const { handleGameStart } = useGameStart({
    state: localState,
    isFightOver,
    setState: setLocalState,
    setIsFightIsOver,
  });

  const { handleFightOverState } = useGameOver({
    state: localState,
    setState: setLocalState,
    setGameIsReady,
    setIsFightIsOver,
    iniitialState,
  });

  useEffect(() => {
    if (opponentIsReaady) {
      setGameIsReady(true);
      const starting = Math.round(Math.random());

      setLocalState({
        ...localState,
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

  const willAttackFristLabel = useMemo(
    () =>
      `${
        localState.heroIsStarting === 1
          ? localState.hero?.name
          : localState.opponent?.name
      } will attack first.`,
    [localState],
  );

  if (!gameIsReady) return <h1>Loading...</h1>;

  return (
    <Grid container maxWidth="xl" spacing={2} className="centered">
      <Grid item xs={6}>
        <p>
          <b>Your life points: {getLifePoints(localState.hero)}</b>
        </p>
      </Grid>
      <Grid item xs={6}>
        <p>
          <b>Your opponent life points: {getLifePoints(localState.opponent)}</b>
        </p>
      </Grid>
      <Grid item xs={12}>
        {willAttackFristLabel}
        {localState.logger.map((el, index) => {
          return <p key={index}>{el}</p>;
        })}
        {!localState.isFighting && (
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
