import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { useCreateOpponentMock } = vi.hoisted(() => ({
  useCreateOpponentMock: vi.fn(),
}));

vi.mock('../hooks', () => ({
  useCreateOpponent: useCreateOpponentMock,
}));

import { OpponentCard } from '../modules/OpponentCard';

describe('OpponentCard', () => {
  beforeEach(() => {
    useCreateOpponentMock.mockReturnValue({
      opponent: {
        name: 'Glimmer',
        image: 'assets/images/Mons1.png',
        level: 1,
        points: 0,
        stats: [
          { name: 'attack', value: 10 },
          { name: 'defense', value: 10 },
          { name: 'life', value: 10 },
        ],
        isReady: true,
      },
    });
  });

  it('displays stat names with consistent capitalization', () => {
    render(<OpponentCard />);

    expect(screen.getByText('Attack: 10')).toBeInTheDocument();
    expect(screen.getByText('Defense: 10')).toBeInTheDocument();
    expect(screen.getByText('Life: 10')).toBeInTheDocument();
    expect(screen.queryByText('Level: 1')).not.toBeInTheDocument();
  });
});
