import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ActionButtons } from '../components/CharacterCard/ActionButtons';
import { setStatusCode } from '../redux/actions/game';
import { GAME_STATUS } from '../redux/constants/game';
import { rootReducer } from '../redux/reducers';

describe('ActionButtons', () => {
  it('places Cancel before Save and calls the cancel handler', async () => {
    const user = userEvent.setup();
    const store = createStore(rootReducer);
    const handleCancel = vi.fn();

    render(
      <Provider store={store}>
        <ActionButtons
          character={{ ...store.getState().character, isEditing: true }}
          points={5}
          hasChanges={true}
          handleCancel={handleCancel}
          handleSave={vi.fn()}
        />
      </Provider>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.map((button) => button.textContent)).toEqual([
      'Cancel',
      'Save',
    ]);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it.each([
    { level: 1, label: 'Create Character' },
    { level: 2, label: 'Level Up' },
  ])('shows "$label" at level $level', ({ level, label }) => {
    const store = createStore(rootReducer);
    store.dispatch(setStatusCode(GAME_STATUS.CHARACTER_SCREEN));

    render(
      <Provider store={store}>
        <ActionButtons
          character={{ ...store.getState().character, level }}
          points={5}
          hasChanges={false}
          handleCancel={vi.fn()}
          handleSave={vi.fn()}
        />
      </Provider>,
    );

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it.each([
    { level: 1, label: 'Create Character' },
    { level: 2, label: 'Level Up' },
  ])(
    'hides "$label" at level $level when no points remain',
    ({ level, label }) => {
      const store = createStore(rootReducer);
      store.dispatch(setStatusCode(GAME_STATUS.CHARACTER_SCREEN));

      render(
        <Provider store={store}>
          <ActionButtons
            character={{ ...store.getState().character, level }}
            points={0}
            hasChanges={false}
            handleCancel={vi.fn()}
            handleSave={vi.fn()}
          />
        </Provider>,
      );

      expect(
        screen.queryByRole('button', { name: label }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Start game' }),
      ).toBeInTheDocument();
    },
  );

  it.each([
    { hasChanges: false, disabled: true },
    { hasChanges: true, disabled: false },
  ])(
    'sets Save disabled=$disabled when hasChanges=$hasChanges',
    ({ hasChanges, disabled }) => {
      const store = createStore(rootReducer);

      render(
        <Provider store={store}>
          <ActionButtons
            character={{ ...store.getState().character, isEditing: true }}
            points={5}
            hasChanges={hasChanges}
            handleCancel={vi.fn()}
            handleSave={vi.fn()}
          />
        </Provider>,
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      if (disabled) {
        expect(saveButton).toBeDisabled();
      } else {
        expect(saveButton).not.toBeDisabled();
      }
    },
  );
});
