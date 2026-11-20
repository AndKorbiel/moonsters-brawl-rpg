import { beforeEach, describe, expect, it, vi } from 'vitest';

const { addDoc, collection, getDocs } = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(() => 'high-score-collection'),
  getDocs: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({ addDoc, collection, getDocs }));
vi.mock('../firebase-db', () => ({ db: {} }));

import setHighScore, { getHighScoreData } from '../utils/HighScoreDataOperations';

describe('HighScoreDataOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addDoc.mockResolvedValue({});
  });

  it('returns typed high scores in descending level order', async () => {
    getDocs.mockResolvedValue({
      docs: [
        { id: 'low', data: () => ({ name: 'Low', level: 1 }) },
        { id: 'high', data: () => ({ name: 'High', level: 5 }) },
      ],
    });

    const results = await getHighScoreData();

    expect(results.map(({ id }) => id)).toEqual(['high', 'low']);
  });

  it('persists a dated copy without mutating the character', async () => {
    const character = {
      name: 'Hero',
      image: 'hero.png',
      level: 3,
      points: 5,
      stats: [{ name: 'attack' as const, value: 12 }],
      gold: 40,
      items: [],
      isEditing: false,
    };

    await setHighScore(character);

    expect(addDoc).toHaveBeenCalledWith(
      'high-score-collection',
      expect.objectContaining({
        ...character,
        date: new Date().toLocaleDateString('en-GB'),
      }),
    );
    expect(character).not.toHaveProperty('date');
  });
});
