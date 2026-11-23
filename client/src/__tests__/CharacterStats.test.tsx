import { render, screen, within } from '@testing-library/react';
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

  it('places five-point controls outside the single-point controls', () => {
    const editingCharacter = { ...character, isEditing: true };
    render(
      <CharacterStats
        character={editingCharacter}
        handleStatsChange={vi.fn()}
        showGold
        showLevel
        points={5}
        stats={[
          { name: 'attack', value: 15 },
          { name: 'defense', value: 10 },
          { name: 'life', value: 20 },
        ]}
      />,
    );
    const attackRow = screen.getByText('Attack: 15').closest('li');

    expect(attackRow).not.toBeNull();
    expect(
      within(attackRow!)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(['<<', '-', '+', '>>']);
    expect(
      screen.getByRole('button', { name: 'Remove 5 Attack points' }),
    ).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Add 5 Attack points' }),
    ).toBeEnabled();
  });

  it('disables five-point controls when there are not enough points to change', () => {
    render(
      <CharacterStats
        character={{ ...character, isEditing: true }}
        handleStatsChange={vi.fn()}
        showGold={false}
        showLevel={false}
        points={4}
        stats={[
          { name: 'attack', value: 14 },
          { name: 'defense', value: 10 },
          { name: 'life', value: 20 },
        ]}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Remove 5 Attack points' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Add 5 Attack points' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Remove 5 Defense points' }),
    ).toBeDisabled();
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
