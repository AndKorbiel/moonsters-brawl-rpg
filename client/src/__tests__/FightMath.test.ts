import { beforeEach, describe, expect, it, vi } from 'vitest';

import { calculateFightStats } from '../utils/FightMath';
import { LocalFightLogicState } from '../components/FightLogicContainer';

const fightState: LocalFightLogicState = {
  fightWon: false,
  hero: {
    name: 'Hero',
    image: 'hero.png',
    level: 1,
    points: 0,
    stats: [
      { name: 'attack', value: 10 },
      { name: 'defense', value: 10 },
      { name: 'life', value: 20 },
    ],
    gold: 0,
    items: [],
    isEditing: false,
  },
  opponent: {
    name: 'Opponent',
    level: 1,
    image: 'opponent.png',
    points: 0,
    stats: [
      { name: 'attack', value: 10 },
      { name: 'defense', value: 10 },
      { name: 'life', value: 20 },
    ],
    isReady: true,
  },
  heroIsStarting: 1,
  activePlayer: true,
  isFighting: true,
  logger: ['Fight started'],
  previousOpponent: '',
};

describe('calculateFightStats', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('updates fight data without mutating its input', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.99);
    const state = structuredClone(fightState);
    const originalState = structuredClone(state);

    const result = calculateFightStats(state);

    expect(state).toEqual(originalState);
    expect(result.opponent?.stats.find((stat) => stat.name === 'life')?.value)
      .toBe(8);
    expect(result.logger).toEqual(['Fight started', 'Hero has attacked for 12']);
    expect(result.logger).not.toBe(state.logger);
  });
});
