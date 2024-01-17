import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';

export const ActionButtons = ({
  character,
  points,
  statusCode,
  handleEditMode,
  handleSave,
  setStatusCode,
}) => {
  const dispatch = useDispatch();

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
            onClick={() => handleEditMode(true)}
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
