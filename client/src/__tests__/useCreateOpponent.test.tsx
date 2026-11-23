import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getNewNameEffect } from '../redux/effects/opponent';
import { levelUp } from '../redux/actions/opponent';
import { rootReducer } from '../redux/reducers';
import { useCreateOpponent } from '../hooks/useCreateOpponent';

vi.mock('../redux/effects/opponent', () => ({
  getNewNameEffect: vi.fn(),
}));

describe('useCreateOpponent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(getNewNameEffect).mockResolvedValue('Glimmer');
  });

  it('stores the generated opponent stats used by the card and combat', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const store = createStore(rootReducer);
    store.dispatch(
      levelUp({
        level: 2,
        points: 2,
        stats: [
          { name: 'attack', value: 10 },
          { name: 'defense', value: 10 },
          { name: 'life', value: 10 },
        ],
        isReady: false,
      }),
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useCreateOpponent(), { wrapper });

    await waitFor(() => {
      expect(store.getState().opponent.isReady).toBe(true);
    });

    expect(store.getState().opponent).toMatchObject({
      name: 'Glimmer',
      image: 'assets/images/Mons1.png',
      level: 2,
      stats: [
        { name: 'attack', value: 12 },
        { name: 'defense', value: 10 },
        { name: 'life', value: 10 },
      ],
      isReady: true,
    });
    expect(result.current.opponent).toEqual(store.getState().opponent);
  });
});
