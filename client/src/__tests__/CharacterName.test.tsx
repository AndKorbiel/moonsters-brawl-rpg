import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CharacterName } from '../components/CharacterCard/CharacterName';
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
  isEditing: true,
};

describe('CharacterName', () => {
  it('allows the name to be edited while creating a level-1 character', () => {
    render(
      <CharacterName
        character={character}
        handleNameChange={vi.fn()}
        validation={{ name: false }}
      />,
    );

    expect(
      screen.getByRole('textbox', { name: 'Your name' }),
    ).toBeInTheDocument();
  });

  it('keeps the name read-only while leveling up', () => {
    render(
      <CharacterName
        character={{ ...character, level: 2 }}
        handleNameChange={vi.fn()}
        validation={{ name: false }}
      />,
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Moonster')).toBeInTheDocument();
  });
});
