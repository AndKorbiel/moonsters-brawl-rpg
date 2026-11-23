import { act, renderHook } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { useState, type PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';

import { useStatsChange } from '../hooks/useStatsChange';
import { rootReducer } from '../redux/reducers';
import type { CharacterLocalState } from '../modules';

const createLocalState = (
  overrides: Partial<CharacterLocalState> = {},
): CharacterLocalState => ({
  name: 'Moonster',
  image: 'assets/images/frank.png',
  level: 1,
  points: 5,
  stats: [
    { name: 'attack', value: 10 },
    { name: 'defense', value: 10 },
    { name: 'life', value: 20 },
  ],
  gold: 20,
  items: [],
  isEditing: true,
  validation: { name: false },
  ...overrides,
});

function renderStatsChange(initialState: CharacterLocalState) {
  const store = createStore(rootReducer);
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return renderHook(
    () => {
      const [state, setState] = useState(initialState);
      const { handleStatsChange } = useStatsChange(setState);
      return { state, handleStatsChange };
    },
    { wrapper },
  );
}

describe('useStatsChange', () => {
  it('adds and removes five points while updating the points remaining', () => {
    const { result } = renderStatsChange(createLocalState());

    act(() => result.current.handleStatsChange('attack', 5));

    expect(
      result.current.state.stats?.find((stat) => stat.name === 'attack')?.value,
    ).toBe(15);
    expect(result.current.state.points).toBe(0);

    act(() => result.current.handleStatsChange('attack', -5));

    expect(
      result.current.state.stats?.find((stat) => stat.name === 'attack')?.value,
    ).toBe(10);
    expect(result.current.state.points).toBe(5);
  });

  it('does not spend more points than are available', () => {
    const { result } = renderStatsChange(createLocalState({ points: 4 }));

    act(() => result.current.handleStatsChange('attack', 5));

    expect(
      result.current.state.stats?.find((stat) => stat.name === 'attack')?.value,
    ).toBe(10);
    expect(result.current.state.points).toBe(4);
  });

  it('does not remove more stat points than were allocated', () => {
    const { result } = renderStatsChange(
      createLocalState({
        points: 1,
        stats: [
          { name: 'attack', value: 14 },
          { name: 'defense', value: 10 },
          { name: 'life', value: 20 },
        ],
      }),
    );

    act(() => result.current.handleStatsChange('attack', -5));

    expect(
      result.current.state.stats?.find((stat) => stat.name === 'attack')?.value,
    ).toBe(14);
    expect(result.current.state.points).toBe(1);
  });

  it('retains single-point stat allocation', () => {
    const { result } = renderStatsChange(createLocalState());

    act(() => result.current.handleStatsChange('attack', 1));

    expect(
      result.current.state.stats?.find((stat) => stat.name === 'attack')?.value,
    ).toBe(11);
    expect(result.current.state.points).toBe(4);

    act(() => result.current.handleStatsChange('attack', -1));

    expect(
      result.current.state.stats?.find((stat) => stat.name === 'attack')?.value,
    ).toBe(10);
    expect(result.current.state.points).toBe(5);
  });
});
