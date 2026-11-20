import { describe, expect, it } from 'vitest';

import { calculateStatsFromItem } from '../redux/actions/character';
import character from '../redux/reducers/character';

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
});
