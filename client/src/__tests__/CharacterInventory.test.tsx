import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CharacterInventory } from '../components/CharacterCard/CharacterInventory';
import { buyItem, calculateStatsFromItem } from '../redux/actions/character';
import { rootReducer } from '../redux/reducers';
import { Item, ItemRarity, ItemType } from '../types';

const sword: Item = {
  id: 1,
  name: 'Sword',
  image: 'sword.png',
  price: 10,
  rarity: ItemRarity.COMMON,
  type: ItemType.WEAPON,
  stats: [{ name: 'attack', value: 5 }],
};

describe('CharacterInventory', () => {
  it('shows the weapon placeholder in the first slot by default', () => {
    const store = createStore(rootReducer);
    const character = store.getState().character;

    const { container } = render(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop={false} />
      </Provider>,
    );

    const placeholder = container.querySelector(
      '.inventory-placeholder img',
    );
    expect(placeholder).toHaveAttribute(
      'src',
      'assets/images/wepon_placeholder.svg',
    );
  });

  it('shows a weapon in the first slot instead of the placeholder', () => {
    const store = createStore(rootReducer);
    const character = {
      ...store.getState().character,
      items: [sword],
    };

    const { container } = render(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop={false} />
      </Provider>,
    );

    expect(
      container.querySelector('.inventory-placeholder-weapon'),
    ).not.toBeInTheDocument();
  });

  it('shows the correct placeholders for all empty item types', () => {
    const store = createStore(rootReducer);
    const character = store.getState().character;

    const { container } = render(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop={false} />
      </Provider>,
    );

    expect(
      container.querySelector('.inventory-placeholder-weapon img'),
    ).toHaveAttribute('src', 'assets/images/wepon_placeholder.svg');
    expect(
      container.querySelector('.inventory-placeholder-off-hand img'),
    ).toHaveAttribute('src', 'assets/images/off_hand_placeholder.svg');
    expect(
      container.querySelector('.inventory-placeholder-armor img'),
    ).toHaveAttribute('src', 'assets/images/armor_placeholder.svg');
    expect(
      container.querySelector('.inventory-placeholder-magic img'),
    ).toHaveAttribute('src', 'assets/images/magic_item_placeholder.svg');
  });

  it('renders four inventory slots with two slots per row', () => {
    const store = createStore(rootReducer);
    const character = {
      ...store.getState().character,
      items: [sword],
    };

    const { container } = render(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop={false} />
      </Provider>,
    );

    expect(container.querySelectorAll('.inventory-box')).toHaveLength(4);
  });

  it('only offers item removal when dropping is enabled', () => {
    const store = createStore(rootReducer);
    const character = {
      ...store.getState().character,
      items: [sword],
    };

    const { container, rerender } = render(
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

    const dropButton = screen.getByRole('button', { name: 'Drop item' });
    expect(dropButton).toBeInTheDocument();
    expect(
      container.querySelector('.inventory-drop-actions')?.lastElementChild,
    ).toBe(dropButton);
  });

  it('shows item details when dropping is disabled', () => {
    const store = createStore(rootReducer);
    const character = {
      ...store.getState().character,
      items: [sword],
    };

    render(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop={false} />
      </Provider>,
    );

    expect(screen.getByText('Sword')).toBeInTheDocument();
    expect(screen.getByText('Price: 10 gold')).toBeInTheDocument();
    expect(screen.getByText('Rarity: Common')).toBeInTheDocument();
    expect(screen.getByText('+5 Attack')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Drop item' }),
    ).not.toBeInTheDocument();
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
