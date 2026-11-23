import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { setOpponent } from '../redux/actions/opponent';
import { getNewNameEffect } from '../redux/effects/opponent';
import { AppState } from '../types';
import { randomIntFromInterval } from '../utils';

export const useCreateOpponent = () => {
  const dispatch = useDispatch();
  const { opponent } = useSelector((state: AppState) => ({
    opponent: state.opponent,
  }));

  useEffect(() => {
    if (opponent.isReady) return;

    let cancelled = false;
    const init = async () => {
      const name: string = await getNewNameEffect().catch(() => 'MooNsterOpp');
      if (cancelled) return;

      const stats = opponent.stats.map((stat) => ({ ...stat }));
      const statNames = ['attack', 'defense', 'life'];

      for (let n = opponent.points; n > 0; n--) {
        const random = randomIntFromInterval(0, statNames.length - 1);
        const stat = stats.find((entry) => entry.name === statNames[random]);
        if (stat) stat.value += 1;
      }

      dispatch(
        setOpponent({
          ...opponent,
          name,
          image: `assets/images/Mons${randomIntFromInterval(1, 4)}.png`,
          stats,
          isReady: true,
        }),
      );
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [dispatch, opponent]);

  return { opponent };
};
