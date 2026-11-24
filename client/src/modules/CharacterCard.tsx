import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { useStatsChange, useStatsSave } from '../hooks';
import { AppState, CharacterState } from '../types';
import { CardMedia } from '@mui/material';
import { GAME_STATUS } from '../redux/constants/game';
import { PixelPanel } from '../components/ui/PixelPanel';
import { colors, px } from '../theme/tokens';
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

  const { handleStatsChange } = useStatsChange(setLocalState);
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
    <PixelPanel
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: px(6),
        backgroundColor: colors.panel,
      }}
    >
      <CharacterName
        character={character}
        handleNameChange={handleNameChange}
        validation={localState.validation}
      />

      <PixelPanel
        sx={{
          width: px(64),
          height: px(64),
          mx: 'auto',
          p: px(5),
          boxSizing: 'border-box',
          flexShrink: 0,
          background: `linear-gradient(to bottom, ${colors.portraitStart}, ${colors.portraitEnd})`,
        }}
      >
        <CardMedia
          component="img"
          image={character.image}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </PixelPanel>

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
    </PixelPanel>
  );
};
