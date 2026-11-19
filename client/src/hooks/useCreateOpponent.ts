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
    const stats = opponent.stats.map((el) => ({ ...el }));
    const statNames = ['attack', 'defense', 'life'];

    for (let n = points; n > 0; n--) {
      const random = randomIntFromInterval(0, 2);
      const stat = stats.find((el) => el.name === statNames[random]);
      if (stat) stat.value += 1;
    }
    setStats(stats);
  }, [opponent.points, opponent.stats]);

  useEffect(() => {
    if (opponent.isReady) return;

    let cancelled = false;
    const init = async () => {
      const name: string = await getNewNameEffect().catch(() => 'MooNsterOpp');
      if (cancelled) return;

      dispatch(setName(name));
      dispatch(setImage(randomIntFromInterval(1, 4)));
      handleSetStats();
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [dispatch, handleSetStats, opponent.isReady]);

  return { opponent, opponentStats };
};
