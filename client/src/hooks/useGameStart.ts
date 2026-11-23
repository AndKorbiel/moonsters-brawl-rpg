import { useCallback } from 'react';
import { calculateFightStats } from '../utils/FightMath';
import { LocalFightLogicState } from '../components';

type GameStartHookProps = {
  state: LocalFightLogicState;
  isFightOver: boolean;
  setState: React.Dispatch<React.SetStateAction<LocalFightLogicState>>;
  setIsFightIsOver: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useGameStart = ({
  state,
  isFightOver,
  setState,
  setIsFightIsOver,
}: GameStartHookProps) => {
  const handleGameStart = useCallback(() => {
    return setTimeout(() => {
      if (!isFightOver) {
        if (
          state.hero &&
          state.opponent &&
          (state.hero.stats.find((stat) => stat.name === 'life')?.value ?? 0) >
            0 &&
          (state.opponent.stats.find((stat) => stat.name === 'life')?.value ??
            0) > 0
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
          setState({
            ...state,
            logger: [...state.logger, message],
            isFighting: false,
            fightWon: fightWon,
          });
        }
      }
    }, 300);
  }, [isFightOver, setIsFightIsOver, setState, state]);

  return { handleGameStart };
};
