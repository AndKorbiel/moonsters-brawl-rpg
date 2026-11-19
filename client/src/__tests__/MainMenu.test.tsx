import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { GAME_OVER } from '../redux/constants/game';
import { MainMenu } from '../modules/MainMenu';

const menuOptions = [
  { value: 1, label: 'New Game' },
  { value: 5, label: 'Save Game' },
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

    expect(store.getState().game.statusCode).toBe(1);
  });
});
