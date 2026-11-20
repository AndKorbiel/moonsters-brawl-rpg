import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ActionButtons } from '../components/CharacterCard/ActionButtons';
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
});
