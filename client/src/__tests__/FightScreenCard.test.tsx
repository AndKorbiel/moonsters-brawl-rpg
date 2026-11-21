import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FightScreenCard } from '../modules/FightScreenCard';
import { rootReducer } from '../redux/reducers';

describe('FightScreenCard', () => {
  it('shows the Fight button until the fight is started', () => {
    const store = createStore(rootReducer);

    render(
      <Provider store={store}>
        <FightScreenCard />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Fight' }));

    expect(
      screen.queryByRole('button', { name: 'Fight' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
