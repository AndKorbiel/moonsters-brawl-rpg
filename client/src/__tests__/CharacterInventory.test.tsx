import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CharacterInventory } from '../components/CharacterCard/CharacterInventory';
import { buyItem, calculateStatsFromItem } from '../redux/actions/character';
import { rootReducer } from '../redux/reducers';
import { Item } from '../types';

const sword: Item = {
  id: 1,
  name: 'Sword',
  image: 'sword.png',
  price: 99,
  stats: [{ name: 'attack', value: 10 }],
};

describe('CharacterInventory', () => {
  it('only offers item removal when dropping is enabled', () => {
    const store = createStore(rootReducer);
    const character = {
      ...store.getState().character,
      items: [sword],
    };

    const { rerender } = render(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop={false} />
      </Provider>,
    );

    expect(
      screen.queryByRole('button', { name: 'Drop item' }),
    ).not.toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop />
      </Provider>,
    );

    expect(screen.getByRole('button', { name: 'Drop item' })).toBeInTheDocument();
  });

  it('drops the item and reverses its stat bonus when selected', () => {
    const store = createStore(rootReducer);
    store.dispatch(buyItem(sword));
    store.dispatch(calculateStatsFromItem(sword.stats));

    render(
      <Provider store={store}>
        <CharacterInventory
          character={store.getState().character}
          allowDrop
        />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Drop item' }));

    expect(store.getState().character.items).toEqual([]);
    expect(
      store
        .getState()
        .character.stats.find((stat) => stat.name === 'attack')?.value,
    ).toBe(10);
  });
});
