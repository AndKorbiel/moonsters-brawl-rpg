import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { useDispatch, useSelector } from 'react-redux';
import { handleEditMode } from '../../redux/actions/character';
import { setStatusCode } from '../../redux/actions/game';
import { GAME_STATUS } from '../../redux/constants/game';
import { AppState, CharacterState } from '../../types';
import { CharacterLocalState } from '../../modules';
import { colors, px } from '../../theme/tokens';

type ActionButtonsProps = {
  character: CharacterState;
  points: CharacterLocalState['points'];
  hasChanges: boolean;
  handleCancel: () => void;
  handleSave: () => void;
};

export const ActionButtons = ({
  character,
  points,
  hasChanges,
  handleCancel,
  handleSave,
}: ActionButtonsProps) => {
  const dispatch = useDispatch();
  const { statusCode } = useSelector((state: AppState) => ({
    statusCode: state.game.statusCode,
  }));

  return (
    <CardContent
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        gap: px(8),
        px: 0,
        pt: px(30),
        pb: px(8),
        '&:last-child': { pb: px(8) },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: px(10),
          left: px(40),
          right: px(40),
          height: px(),
          backgroundColor: colors.goldDark,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: px(7),
          left: '50%',
          width: px(6),
          height: px(6),
          backgroundColor: colors.goldMid,
          clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
          transform: 'translateX(-50%)',
        },
        '& > .MuiButton-root': {
          flex: '1 1 0',
          minWidth: px(46),
          minHeight: px(24),
          fontSize: 24,
        },
        [`@media (max-width: ${px(200)})`]: {
          gap: px(4),
          '& > .MuiButton-root': {
            minWidth: 0,
            fontSize: 20,
          },
        },
      }}
    >
      {character.isEditing ? (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!hasChanges}
            onClick={handleSave}
          >
            Save
          </Button>
        </>
      ) : (
        statusCode === GAME_STATUS.CHARACTER_SCREEN &&
        points !== undefined &&
        points > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => dispatch(handleEditMode(true))}
          >
            {character.level === 1 ? 'Create Character' : 'Level Up'}
          </Button>
        )
      )}

      {!character.isEditing &&
        statusCode === GAME_STATUS.CHARACTER_SCREEN &&
        points === 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => dispatch(setStatusCode(GAME_STATUS.FIGHT_SCREEN))}
          >
            Start game
          </Button>
        )}
    </CardContent>
  );
};
