import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FightScreenCard } from '../modules/FightScreenCard';
import { rootReducer } from '../redux/reducers';
import { START_FIGHT } from '../redux/constants/game';
import { setOpponent } from '../redux/actions/opponent';

describe('FightScreenCard', () => {
  it('shows the Fight button until the fight is started', () => {
    const store = createStore(rootReducer);

    render(
      <Provider store={store}>
        <FightScreenCard />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start the brawl' }));

    expect(
      screen.queryByRole('button', { name: 'Start the brawl' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('scrolls the log to the bottom when a message is added', () => {
    vi.useFakeTimers();

    try {
      const store = createStore(rootReducer);
      store.dispatch({ type: START_FIGHT });
      store.dispatch(
        setOpponent({
          name: 'Training Dummy',
          level: 1,
          image: '',
          points: 0,
          stats: [
            { name: 'attack', value: 1 },
            { name: 'defense', value: 0 },
            { name: 'life', value: 1000 },
          ],
          isReady: false,
        }),
      );

      let scrollTop = 0;
      render(
        <Provider store={store}>
          <FightScreenCard />
        </Provider>,
      );

      const log = screen.getByRole('list');
      Object.defineProperty(log, 'scrollHeight', {
        configurable: true,
        value: 500,
      });
      Object.defineProperty(log, 'scrollTop', {
        configurable: true,
        get: () => scrollTop,
        set: (value: number) => {
          scrollTop = value;
        },
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(scrollTop).toBe(500);
    } finally {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
});
