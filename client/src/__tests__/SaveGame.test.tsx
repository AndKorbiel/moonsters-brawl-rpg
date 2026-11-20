import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SaveGame } from '../components/MainMenu/SaveGame';
import { setCurrentUser } from '../redux/actions/user';
import { rootReducer } from '../redux/reducers';
import { SavedGame } from '../types';

const {
  addDoc,
  collection,
  doc,
  updateDoc,
  getSavedGamesEffect,
} = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(() => 'games-collection'),
  doc: vi.fn(() => 'game-document'),
  updateDoc: vi.fn(),
  getSavedGamesEffect: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({ addDoc, collection, doc, updateDoc }));
vi.mock('../firebase-db', () => ({ db: {} }));
vi.mock('../redux/effects/user', () => ({ getSavedGamesEffect }));

const savedGame: SavedGame = {
  game: {
    id: 'save-1',
    statusCode: 1,
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
  shop: { availableItems: [] },
  date: '01/01/2020',
  userId: 'player-1',
};

const renderSaveGame = () => {
  const store = createStore(rootReducer);
  store.dispatch(
    setCurrentUser({ email: 'player@example.com', uid: 'player-1' }),
  );

  return render(
    <Provider store={store}>
      <SaveGame />
    </Provider>,
  );
};

describe('SaveGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addDoc.mockResolvedValue({});
    updateDoc.mockResolvedValue({});
    getSavedGamesEffect.mockResolvedValue([savedGame]);
  });

  it('saves a new game and reports success', async () => {
    renderSaveGame();

    fireEvent.click(screen.getByRole('button', { name: 'Save new game' }));

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(addDoc.mock.calls[0][1].date).toBe(
      new Date().toLocaleDateString('en-GB'),
    );
    expect(addDoc.mock.calls[0][1].userId).toBe('player-1');
    expect(await screen.findByText('Game saved')).toBeInTheDocument();
  });

  it('reports a new-save failure', async () => {
    addDoc.mockRejectedValue(new Error('Firestore unavailable'));
    renderSaveGame();

    fireEvent.click(screen.getByRole('button', { name: 'Save new game' }));

    expect(
      await screen.findByText('Unable to save game. Please try again.'),
    ).toBeInTheDocument();
  });

  it('updates the date when overwriting and reports success', async () => {
    renderSaveGame();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Overwrite game' }),
    );

    await waitFor(() => expect(updateDoc).toHaveBeenCalledTimes(1));
    expect(updateDoc.mock.calls[0][1].date).toBe(
      new Date().toLocaleDateString('en-GB'),
    );
    expect(await screen.findByText('Game saved')).toBeInTheDocument();
  });

  it('reports an overwrite failure', async () => {
    updateDoc.mockRejectedValue(new Error('Firestore unavailable'));
    renderSaveGame();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Overwrite game' }),
    );

    expect(
      await screen.findByText('Unable to save game. Please try again.'),
    ).toBeInTheDocument();
  });
});
