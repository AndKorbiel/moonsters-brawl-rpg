import { describe, expect, it } from 'vitest';

import { buyItem, calculateStatsFromItem } from '../redux/actions/character';
import character from '../redux/reducers/character';
import { Item, ItemRarity, ItemType } from '../types';

const sword: Item = {
  id: 0,
  name: 'Sword',
  image: 'sword.jpg',
  price: 10,
  rarity: ItemRarity.COMMON,
  type: ItemType.WEAPON,
  stats: [{ name: 'attack', value: 5 }],
};

describe('character reducer', () => {
  it('applies numeric item stat values without parsing or logging', () => {
    const state = character(
      undefined,
      calculateStatsFromItem([{ name: 'attack', value: 1.5 }]),
    );

    expect(state.stats.find((stat) => stat.name === 'attack')?.value).toBe(
      11.5,
    );
  });

  it('starts with 20 gold and rejects a second item of the same type', () => {
    const initialState = character(undefined, calculateStatsFromItem([]));
    const afterFirstPurchase = character(initialState, buyItem(sword));
    const afterSecondPurchase = character(
      afterFirstPurchase,
      buyItem({ ...sword, id: 1 }),
    );

    expect(initialState.gold).toBe(20);
    expect(afterSecondPurchase.gold).toBe(10);
    expect(afterSecondPurchase.items).toEqual([sword]);
  });
});
