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

const stylesFor = (element: HTMLElement) => {
  const emotionClass = Array.from(element.classList).find((name) =>
    name.startsWith('css-'),
  );
  if (!emotionClass) throw new Error('Expected an Emotion class on the menu item');

  return Array.from(document.querySelectorAll('style[data-emotion]'))
    .map((style) => style.textContent ?? '')
    .join('')
    .split('}')
    .filter((rule) => rule.includes(`.${emotionClass}`))
    .join('}');
};

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

  it('shows menu arrows and highlight only on hover', () => {
    render(
      <Provider store={store}>
        <MainMenu options={menuOptions} />
      </Provider>,
    );

    const menuItems = screen.getAllByRole('menuitem');
    const itemStyles = stylesFor(menuItems[0]);

    expect(itemStyles).toMatch(/::before[^{}]*\{[^}]*visibility:\s*hidden/);
    expect(itemStyles).toMatch(/:hover::before[^{}]*\{[^}]*visibility:\s*visible/);
    expect(itemStyles).not.toContain(':first-of-type');
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
