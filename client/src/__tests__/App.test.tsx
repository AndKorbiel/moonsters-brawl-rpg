import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { GAME_OVER } from '../redux/constants/game';
import App from '../App';

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

describe('App', () => {
  beforeEach(() => {
    store.dispatch({ type: GAME_OVER });
  });

  it('renders the title and main menu', async () => {
    renderApp();

    expect(await screen.findByText('Moonster Brawl RPG')).toBeInTheDocument();
    expect(screen.getByTestId('main-menu')).toBeInTheDocument();
  });

  it('opens the shop when starting a new game', async () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /new game/i }));

    expect(await screen.findByText('Welcome in the Magic Shop')).toBeInTheDocument();
  });

  it('returns to the main menu from the menu button', async () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /new game/i }));
    await screen.findByText('Welcome in the Magic Shop');
    fireEvent.click(await screen.findByRole('button', { name: /menu/i }));

    expect(screen.getByTestId('main-menu')).toBeInTheDocument();
  });
});
