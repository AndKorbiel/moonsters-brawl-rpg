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

  it('uses the hero defense when the opponent attacks', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5);
    const state = structuredClone(fightState);
    state.activePlayer = false;
    state.hero.stats.find((stat) => stat.name === 'defense')!.value = 10;
    state.opponent.stats.find((stat) => stat.name === 'defense')!.value = 0;

    const result = calculateFightStats(state);

    expect(result.hero?.stats.find((stat) => stat.name === 'life')?.value).toBe(
      20,
    );
    expect(result.logger.at(-1)).toBe('Opponent has been blocked');
  });

  it('uses the opponent defense when the hero attacks', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5);
    const state = structuredClone(fightState);
    state.hero.stats.find((stat) => stat.name === 'defense')!.value = 0;
    state.opponent.stats.find((stat) => stat.name === 'defense')!.value = 10;

    const result = calculateFightStats(state);

    expect(result.opponent?.stats.find((stat) => stat.name === 'life')?.value)
      .toBe(20);
    expect(result.logger.at(-1)).toBe('Hero has been blocked');
  });

  it('does not block when the roll exceeds the equal-stat 50% chance', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.51);
    const state = structuredClone(fightState);

    const result = calculateFightStats(state);

    expect(result.opponent?.stats.find((stat) => stat.name === 'life')?.value)
      .toBe(10);
    expect(result.logger.at(-1)).toBe('Hero has attacked for 10');
  });

  it('uses defense divided by defense plus incoming damage', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.34);
    const state = structuredClone(fightState);
    state.opponent.stats.find((stat) => stat.name === 'defense')!.value = 5;

    const result = calculateFightStats(state);

    expect(result.opponent?.stats.find((stat) => stat.name === 'life')?.value)
      .toBe(10);
    expect(result.logger.at(-1)).toBe('Hero has attacked for 10');
  });

  it('does not roll damage above 1.4 times attack when the maximum is fractional', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.999)
      .mockReturnValueOnce(0.99);
    const state = structuredClone(fightState);
    state.hero.stats.find((stat) => stat.name === 'attack')!.value = 11;

    const result = calculateFightStats(state);

    expect(result.logger.at(-1)).toBe('Hero has attacked for 15');
  });
});
