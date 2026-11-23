import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HighScore } from '../components/MainMenu/HighScore';

const { getHighScoreData } = vi.hoisted(() => ({
  getHighScoreData: vi.fn(),
}));

vi.mock('../utils', () => ({ getHighScoreData }));

describe('HighScore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays an error when high scores cannot be loaded', async () => {
    getHighScoreData.mockRejectedValue(new Error('Firestore unavailable'));

    render(<HighScore />);

    expect(
      await screen.findByText(
        'Unable to load high scores. Please try again later.',
      ),
    ).toBeInTheDocument();
  });
});
