import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { GAME_OVER, GAME_STATUS } from '../redux/constants/game';
import { MainMenu } from '../modules/MainMenu';

const menuOptions = [
  { value: GAME_STATUS.CHARACTER_SCREEN, label: 'New Game' },
  { value: GAME_STATUS.SAVE_GAME, label: 'Save Game' },
];

describe('MainMenu', () => {
  beforeEach(() => {
    store.dispatch({ type: GAME_OVER });
  });

  it('renders each menu option', () => {
    render(
      <Provider store={store}>
        <MainMenu options={menuOptions} />
      </Provider>,
    );

    expect(screen.getByRole('button', { name: 'New Game' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Game' })).toBeInTheDocument();
  });

  it('updates the active screen when an option is selected', () => {
    render(
      <Provider store={store}>
        <MainMenu options={menuOptions} />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'New Game' }));

    expect(store.getState().game.statusCode).toBe(
      GAME_STATUS.CHARACTER_SCREEN,
    );
  });
});
