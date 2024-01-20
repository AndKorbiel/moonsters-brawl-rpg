import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import { useDispatch, useSelector } from 'react-redux';
import { handleEditMode } from '../../redux/actions/character';
import { setStatusCode } from '../../redux/actions/game';
import { AppState, CharacterState } from '../../types';
import { CharacterLocalState } from '../../modules';

type ActionButtonsProps = {
  character: CharacterState;
  points: CharacterLocalState['points'];
  handleSave: () => void;
};

export const ActionButtons = ({
  character,
  points,
  handleSave,
}: ActionButtonsProps) => {
  const dispatch = useDispatch();
  const { statusCode } = useSelector((state: AppState) => ({
    statusCode: state.game.statusCode,
  }));

  return (
    <CardContent>
      {character.isEditing ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSave()}
        >
          Save
        </Button>
      ) : (
        statusCode === 1 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => dispatch(handleEditMode(true))}
          >
            Set Stats
          </Button>
        )
      )}

      {!character.isEditing && statusCode === 1 && points === 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={() => dispatch(setStatusCode(2))}
        >
          Start game
        </Button>
      )}
    </CardContent>
  );
};
