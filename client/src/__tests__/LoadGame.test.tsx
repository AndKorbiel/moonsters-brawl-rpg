import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoadGame } from '../components/MainMenu/LoadGame';
import { setCurrentUser } from '../redux/actions/user';
import { rootReducer } from '../redux/reducers';
import { GAME_STATUS } from '../redux/constants/game';
import { SavedGame } from '../types';

const { getSavedGamesEffect } = vi.hoisted(() => ({
  getSavedGamesEffect: vi.fn(),
}));

vi.mock('../redux/effects/user', () => ({ getSavedGamesEffect }));
vi.mock('../firebase-db', () => ({ db: {} }));

const savedGame: SavedGame = {
  game: {
    id: 'save-1',
    statusCode: GAME_STATUS.CHARACTER_SCREEN,
    gameStarted: true,
    menuOptions: [],
    fightStarted: false,
    playerHasWon: false,
    currentUser: {},
  },
  character: {
    name: 'Moonster One',
    image: 'assets/images/frank.png',
    level: 2,
    points: 5,
    stats: [],
    gold: 100,
    items: [],
    isEditing: false,
  },
  opponent: {
    name: 'Opponent',
    level: 1,
    image: 'assets/images/Mons1.png',
    points: 0,
    stats: [],
    isReady: true,
  },
  shop: { slots: [] },
  date: '20/11/2026',
  userId: 'player-1',
};

describe('LoadGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a single saved game and fetches games only once per user', async () => {
    getSavedGamesEffect.mockResolvedValue([savedGame]);
    const store = createStore(rootReducer);
    store.dispatch(
      setCurrentUser({ email: 'player@example.com', uid: 'player-1' }),
    );

    render(
      <Provider store={store}>
        <LoadGame />
      </Provider>,
    );

    expect(await screen.findByText('Moonster One')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load game' })).toBeInTheDocument();

    await waitFor(() => {
      expect(getSavedGamesEffect).toHaveBeenCalledTimes(1);
    });
    expect(getSavedGamesEffect).toHaveBeenCalledWith('player-1');
  });
});
