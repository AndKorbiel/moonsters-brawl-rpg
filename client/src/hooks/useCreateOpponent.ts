import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import { setImage, setName } from '../redux/actions/opponent';
import { getNewNameEffect } from '../redux/effects/opponent';
import { AppState, OpponentState } from '../types';
import { randomIntFromInterval } from '../utils';

export const useCreateOpponent = () => {
  const dispatch = useDispatch();
  const { opponent } = useSelector((state: AppState) => ({
    opponent: state.opponent,
  }));

  const [opponentStats, setStats] = useState<OpponentState['stats']>();

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
    const init = async () => {
      const name: string = await getNewNameEffect();
      dispatch(setName(name));
      dispatch(setImage(randomIntFromInterval(1, 4)));
      handleSetStats();
    };

    init();
  }, [dispatch]);

  return { opponent, opponentStats };
};
