import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FightScreenCard } from '../modules/FightScreenCard';
import { rootReducer } from '../redux/reducers';
import { START_FIGHT } from '../redux/constants/game';
import { setOpponent } from '../redux/actions/opponent';
import { colors } from '../theme/tokens';

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
    expect(screen.queryByText(/will attack first/)).not.toBeInTheDocument();
  });

  it('previews the first attacker and uses the same choice when the fight starts', () => {
    vi.useFakeTimers();
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9);

    try {
      const store = createStore(rootReducer);
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
          isReady: true,
        }),
      );

      render(
        <Provider store={store}>
          <FightScreenCard />
        </Provider>,
      );

      expect(screen.getByText('Moonster will attack first.')).toBeInTheDocument();
      expect(screen.getByText("Moonster's life points:")).toBeInTheDocument();
      expect(
        screen.getByText("Training Dummy's life points:"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: '20 of 20 life points' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: '1000 of 1000 life points' }),
      ).toBeInTheDocument();
      const startButton = screen.getByRole('button', {
        name: 'Start the brawl',
      });
      const log = screen.getByRole('list');
      expect(startButton.previousElementSibling).toBe(log);
      expect(log).toHaveStyle({
        maxHeight: '420px',
        overflowY: 'auto',
      });

      fireEvent.click(startButton);

      act(() => {
        vi.advanceTimersByTime(420);
      });

      expect(screen.getByRole('list')).toHaveTextContent(
        'Moonster will attack first.',
      );
    } finally {
      randomSpy.mockRestore();
      vi.clearAllTimers();
      vi.useRealTimers();
    }
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
        vi.advanceTimersByTime(419);
      });

      expect(scrollTop).toBe(0);

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(scrollTop).toBe(500);
    } finally {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });

  it('colors player action logs while leaving opponent action logs unchanged', () => {
    vi.useFakeTimers();
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9);

    try {
      const store = createStore(rootReducer);
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
          isReady: true,
        }),
      );
      store.dispatch({ type: START_FIGHT });

      render(
        <Provider store={store}>
          <FightScreenCard />
        </Provider>,
      );

      for (let turn = 0; turn < 5; turn += 1) {
        act(() => {
          vi.advanceTimersByTime(420);
        });
      }

      const playerLog = screen.getAllByText(/Moonster has attacked for/)[0];
      const opponentLog = screen.getAllByText(
        'Training Dummy has been blocked',
      )[0];

      expect(playerLog.parentElement).toHaveStyle({
        color: colors.goldMid,
      });
      expect(playerLog.querySelector('span')).toHaveStyle({
        color: colors.goldMid,
      });
      expect(opponentLog.parentElement).toHaveStyle({
        color: colors.parchment,
      });
    } finally {
      randomSpy.mockRestore();
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
});
