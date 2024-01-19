import { useDispatch, useSelector } from 'react-redux';

import { setStatusCode } from '../redux/actions/game';
import { GAME_OVER } from '../redux/constants/game';
import { changeStats } from '../redux/actions/character';
import { levelUp, resetStats } from '../redux/actions/opponent';

import setHighScore from '../utils/HighScoreDataOperations';
import { calculateLevelUp } from '../utils/FightMath';

export const useGameOver = (
  state,
  setState,
  setGameIsReady,
  setIsFightIsOver,
  iniitialState,
) => {
  const dispatch = useDispatch();
  const { character, currentUser, opponent } = useSelector((state) => ({
    character: state.character,
    currentUser: state.user.currentUser,
    opponent: state.opponent,
  }));

  const handleFightOverState = () => {
    if (state.fightWon) {
      const calculateStats = calculateLevelUp({ character, opponent });

      dispatch(changeStats(calculateStats.currentStats));
      dispatch(setStatusCode(1));
      dispatch(levelUp(calculateStats.opponent));
    } else {
      dispatch({ type: GAME_OVER });
      dispatch(
        resetStats([
          { name: 'attack', value: 10 },
          { name: 'defense', value: 10 },
          { name: 'life', value: 10 },
        ]),
      );

      if (currentUser?.email) setHighScore(character);
    }

    setIsFightIsOver(false);
    setGameIsReady(false);
    setState({ ...iniitialState });
  };

  return { handleFightOverState };
};
