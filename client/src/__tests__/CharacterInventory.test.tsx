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

const multiStatArmor: Item = {
  id: 2,
  name: 'Arcane Guard',
  image: 'guard.png',
  price: 10,
  rarity: ItemRarity.MAGIC,
  type: ItemType.ARMOR,
  stats: [
    { name: 'defense', value: 10 },
    { name: 'life', value: 5 },
  ],
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

  it('shows pixelated contained weapon art in the first slot instead of the placeholder', () => {
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

    const weaponImage = container.querySelector<HTMLImageElement>(
      '.inventory-box:not(.inventory-placeholder) img',
    );
    if (!weaponImage) {
      throw new Error('Equipped weapon image was not rendered');
    }

    expect(weaponImage).toHaveStyle({
      objectFit: 'contain',
      imageRendering: 'pixelated',
    });
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

  it('renders labeled slots in the required 2x2 layout', () => {
    const store = createStore(rootReducer);
    const character = store.getState().character;

    const { container } = render(
      <Provider store={store}>
        <CharacterInventory character={character} allowDrop={false} />
      </Provider>,
    );

    const inventoryGrid = container.querySelector<HTMLElement>('.inventory-cont');
    if (!inventoryGrid) {
      throw new Error('Inventory grid was not rendered');
    }

    const slots = Array.from(
      container.querySelectorAll<HTMLElement>('.inventory-box'),
    );
    expect(inventoryGrid).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px',
    });
    expect(slots).toHaveLength(4);
    expect(slots.map((slot) => slot.textContent?.trim())).toEqual([
      'Weapon',
      'Off-hand',
      'Armor',
      'Magic item',
    ]);
  });

  it('renders compact slots as an accessible four-column strip', async () => {
    const store = createStore(rootReducer);
    const character = store.getState().character;

    const { container } = render(
      <Provider store={store}>
        <CharacterInventory
          character={character}
          allowDrop={false}
          compact
        />
      </Provider>,
    );

    const inventoryGrid = container.querySelector<HTMLElement>('.inventory-cont');
    expect(inventoryGrid).toHaveStyle({
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: '6px',
    });

    const slots = Array.from(
      container.querySelectorAll<HTMLElement>('.inventory-box'),
    );
    expect(slots.map((slot) => slot.getAttribute('aria-label'))).toEqual([
      'Weapon',
      'Off-hand',
      'Armor',
      'Magic item',
    ]);
    expect(slots.every((slot) => !slot.textContent?.trim())).toBe(true);

    fireEvent.mouseOver(slots[0]);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Weapon');
  });

  it('shows compact equipped item details without the price', async () => {
    const store = createStore(rootReducer);
    const character = {
      ...store.getState().character,
      items: [multiStatArmor],
    };

    const { container } = render(
      <Provider store={store}>
        <CharacterInventory
          character={character}
          allowDrop={false}
          compact
        />
      </Provider>,
    );

    const slots = container.querySelectorAll<HTMLElement>('.inventory-box');
    fireEvent.mouseOver(slots[2]);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Arcane Guard');
    expect(tooltip).toHaveTextContent('Rarity: Magic');
    expect(tooltip).toHaveTextContent('Type: Armor');
    expect(tooltip).toHaveTextContent('+10 Defense');
    expect(tooltip).toHaveTextContent('+5 Life');
    expect(tooltip).not.toHaveTextContent('Price');
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

  it('reverses all stat bonuses when dropping a multi-stat item', () => {
    const store = createStore(rootReducer);
    store.dispatch(buyItem(multiStatArmor));
    store.dispatch(calculateStatsFromItem(multiStatArmor.stats));

    render(
      <Provider store={store}>
        <CharacterInventory
          character={store.getState().character}
          allowDrop
        />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Drop item' }));

    expect(
      store
        .getState()
        .character.stats.find((stat) => stat.name === 'defense')?.value,
    ).toBe(10);
    expect(
      store
        .getState()
        .character.stats.find((stat) => stat.name === 'life')?.value,
    ).toBe(20);
  });
});
