import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CharacterStats } from '../components/CharacterCard/CharacterStats';
import { CharacterState } from '../types';

const character: CharacterState = {
  name: 'Moonster',
  image: 'assets/images/frank.png',
  level: 1,
  points: 5,
  stats: [
    { name: 'attack', value: 10 },
    { name: 'defense', value: 10 },
    { name: 'life', value: 20 },
  ],
  gold: 100,
  items: [],
  isEditing: false,
};

describe('CharacterStats', () => {
  it('shows points to spend while creating or leveling up', () => {
    render(
      <CharacterStats
        character={{ ...character, isEditing: true }}
        handleStatsChange={vi.fn()}
        showGold
        showLevel
        points={5}
        stats={character.stats}
      />,
    );

    expect(screen.getByText('Points to spend: 5')).toBeInTheDocument();
  });

  it('hides points to spend outside character creation or level-up', () => {
    render(
      <CharacterStats
        character={character}
        handleStatsChange={vi.fn()}
        showGold
        showLevel
        points={0}
        stats={character.stats}
      />,
    );

    expect(screen.queryByText(/Points to spend/)).not.toBeInTheDocument();
    expect(screen.getByText('Attack: 10')).toBeInTheDocument();
    expect(screen.getByText('Defense: 10')).toBeInTheDocument();
    expect(screen.getByText('Life: 20')).toBeInTheDocument();
  });

  it('hides gold in fight mode', () => {
    render(
      <CharacterStats
        character={character}
        handleStatsChange={vi.fn()}
        showGold={false}
        showLevel={false}
        points={0}
        stats={character.stats}
      />,
    );

    expect(screen.queryByText('Gold: 100')).not.toBeInTheDocument();
    expect(screen.queryByText('Level: 1')).not.toBeInTheDocument();
  });

  it('shows the gold coin icon beside the character gold amount', () => {
    const { container } = render(
      <CharacterStats
        character={character}
        handleStatsChange={vi.fn()}
        showGold
        showLevel={false}
        points={0}
        stats={character.stats}
      />,
    );

    const goldIcon = container.querySelector(
      'img[src="assets/images/gold-coins.svg"]',
    );
    const goldAmount = screen.getByRole('heading', { name: '100' });

    expect(goldIcon).toBeInTheDocument();
    expect(goldIcon).toHaveStyle({
      height: '18px',
      verticalAlign: 'bottom',
    });
    expect(goldAmount).toBeInTheDocument();
    expect(goldAmount).toHaveStyle({ lineHeight: '18px' });
    expect(screen.queryByText(/Gold:/)).not.toBeInTheDocument();
  });
});
