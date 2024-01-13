import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { setImage } from '../redux/actions/opponent';
import { getNewNameEffect } from '../redux/effects/opponent';

export const useCreateOpponent = () => {
  const dispatch = useDispatch();
  const { opponent } = useSelector((state) => ({
    opponent: state.opponent,
  }));

  const [opponentStats, setStats] = useState();
  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const handleSetStats = useCallback(() => {
    const points = opponent.points;
    const stats = opponent.stats.map((el) => el);

    for (let n = points; n > 0; n--) {
      const random = randomIntFromInterval(0, 2);
      switch (random) {
        case 0:
          stats.filter((el) => el.name === 'attack')[0].value =
            stats.filter((el) => el.name === 'attack')[0].value + 1;
          break;
        case 1:
          stats.filter((el) => el.name === 'defense')[0].value =
            stats.filter((el) => el.name === 'defense')[0].value + 1;
          break;
        case 2:
          stats.filter((el) => el.name === 'life')[0].value =
            stats.filter((el) => el.name === 'life')[0].value + 1;
          break;
        default:
          break;
      }
    }
    setStats(stats);
  }, [opponent]);

  useEffect(() => {
    dispatch(getNewNameEffect());
    dispatch(setImage(randomIntFromInterval(1, 4)));
    handleSetStats();
  }, []);

  return { opponent, opponentStats };
};
