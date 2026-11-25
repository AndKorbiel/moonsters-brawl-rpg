import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { useStatsChange, useStatsSave } from '../hooks';
import { AppState, CharacterState } from '../types';
import { CardMedia } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

  if (statusCode === GAME_STATUS.FIGHT_SCREEN) {
    return (
      <PixelPanel
        sx={{
          height: 'auto',
          alignSelf: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.panel,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: px(6),
            minWidth: 0,
            [`@media (max-width: ${px(160)})`]: {
              flexWrap: 'wrap',
              '& .compact-character-details': { flexBasis: '100%' },
            },
          }}
        >
          <PixelPanel
            sx={{
              width: px(46),
              height: px(46),
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

          <Box className="compact-character-details" sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h5"
              component="div"
              noWrap
              sx={{
                maxWidth: '100%',
                fontSize: 24,
                lineHeight: px(12),
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {character.name}
            </Typography>
            <CharacterStats
              character={character}
              handleStatsChange={handleStatsChange}
              showGold={false}
              showLevel={false}
              points={localState.points}
              stats={localState.stats}
              compact
            />
          </Box>
        </Box>

        <Box
          aria-hidden="true"
          sx={{
            position: 'relative',
            height: px(),
            my: px(3),
            backgroundColor: colors.goldDark,
            '&::after': {
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: px(3),
              height: px(3),
              backgroundColor: colors.goldMid,
              content: '""',
              transform: 'translate(-50%, -50%) rotate(45deg)',
            },
          }}
        />

        <CharacterInventory
          character={character}
          allowDrop={false}
          compact
        />
      </PixelPanel>
    );
  }

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
        showGold
        showLevel
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
    </PixelPanel>
  );
};
