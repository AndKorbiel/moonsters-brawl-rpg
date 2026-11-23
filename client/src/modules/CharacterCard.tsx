import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { useStatsChange, useStatsSave } from '../hooks';
import { AppState, CharacterState } from '../types';
import { Card, CardMedia } from '@mui/material';
import { GAME_STATUS } from '../redux/constants/game';
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
  const { character, statusCode } = useSelector((state: AppState) => ({
    character: state.character,
    statusCode: state.game.statusCode,
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
  const { handleCancel, handleSave } = useStatsSave(localState, setLocalState);
  const hasChanges =
    (localState.name !== undefined && localState.name !== character.name) ||
    (localState.points !== undefined &&
      localState.points !== character.points) ||
    (localState.stats?.some(
      (stat) =>
        character.stats.find(
          (characterStat) => characterStat.name === stat.name,
        )?.value !== stat.value,
    ) ??
      false);

  return (
    <Card sx={{ height: '100%' }}>
      <CharacterName
        character={character}
        handleNameChange={handleNameChange}
        validation={localState.validation}
      />

      <CardMedia component="img" height="140" image={character.image} />

      <CharacterStats
        character={character}
        handleStatsChange={handleStatsChange}
        showGold={statusCode !== GAME_STATUS.FIGHT_SCREEN}
        showLevel={statusCode !== GAME_STATUS.FIGHT_SCREEN}
        points={localState.points}
        stats={localState.stats}
      />

      <ActionButtons
        character={character}
        hasChanges={hasChanges}
        handleCancel={handleCancel}
        handleSave={handleSave}
        points={localState.points}
      />

      {statusCode === GAME_STATUS.FIGHT_SCREEN && (
        <CharacterInventory character={character} allowDrop={false} />
      )}
    </Card>
  );
};
