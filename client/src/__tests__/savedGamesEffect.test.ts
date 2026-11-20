import { beforeEach, describe, expect, it, vi } from 'vitest';

const { collection, getDocs, query, where } = vi.hoisted(() => ({
  collection: vi.fn(() => 'games-collection'),
  getDocs: vi.fn(),
  query: vi.fn((...constraints: unknown[]) => constraints),
  where: vi.fn((field: string, operator: string, value: string) => ({
    field,
    operator,
    value,
  })),
}));

vi.mock('firebase/firestore', () => ({
  collection,
  getDocs,
  query,
  where,
}));
vi.mock('../firebase-db', () => ({ db: {} }));

import { getSavedGamesEffect } from '../redux/effects/user';
import { GAME_STATUS } from '../redux/constants/game';

const savedDocument = (id: string, userId: string) => ({
  id,
  data: () => ({
    userId,
    character: { name: id },
    game: { statusCode: GAME_STATUS.CHARACTER_SCREEN },
  }),
});

describe('getSavedGamesEffect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries only the signed-in user’s saves by ID', async () => {
    const ownedSave = savedDocument('owned-save', 'user-123');
    getDocs.mockResolvedValueOnce({ docs: [ownedSave] });

    const savedGames = await getSavedGamesEffect('user-123');

    expect(where).toHaveBeenCalledTimes(1);
    expect(where).toHaveBeenCalledWith('userId', '==', 'user-123');
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(savedGames.map(({ game }) => game.id)).toEqual(['owned-save']);
  });
});
