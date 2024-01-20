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
          const logger = state.logger;
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

  return { handleGameStart };
};
