import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { useDispatch, useSelector } from 'react-redux';
import { handleEditMode } from '../../redux/actions/character';
import { setStatusCode } from '../../redux/actions/game';
import { GAME_STATUS } from '../../redux/constants/game';
import { AppState, CharacterState } from '../../types';
import { CharacterLocalState } from '../../modules';

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
    <CardContent>
      {character.isEditing ? (
        <>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mr: 1 }}
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
