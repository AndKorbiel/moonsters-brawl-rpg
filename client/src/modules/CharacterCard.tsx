import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { useStatsChange, useStatsSave } from '../hooks';
import { AppState, CharacterState } from '../types';
import { Card, CardMedia } from '@mui/material';
import {
  ActionButtons,
  CharacterInventory,
  CharacterName,
  CharacterStats,
} from '../components/CharacterCard';

export type CharacterLocalState = Partial<CharacterState> & {
  validation: {
    name: boolean;
  };
};

export const CharacterCardContainer = () => {
  const { character } = useSelector((state: AppState) => ({
    character: state.character,
  }));

  const [localState, setLocalState] = useState<CharacterLocalState>({
    validation: {
      name: false,
    },
  });

  useEffect(() => {
    setLocalState((localState) => ({
      ...localState,
      ...character,
    }));
  }, [character]);

  const handleNameChange = (newName: string) => {
    setLocalState((localState) => ({
      ...localState,
      name: newName,
    }));
  };

  const { handleStatsChange } = useStatsChange(localState, setLocalState);
  const { handleSave } = useStatsSave(localState, setLocalState);

  return (
    <Card>
      <CharacterName
        character={character}
        handleNameChange={handleNameChange}
        validation={localState.validation}
      />

      <CardMedia component="img" height="140" image={character.image} />

      <CharacterStats
        character={character}
        handleStatsChange={handleStatsChange}
        points={localState.points}
        stats={localState.stats}
      />

      <ActionButtons
        character={character}
        handleSave={handleSave}
        points={localState.points}
      />

      <CharacterInventory character={character} />
    </Card>
  );
};
