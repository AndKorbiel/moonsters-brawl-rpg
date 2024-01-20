import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import { CharacterState } from '../../types';
import { CharacterLocalState } from '../../modules';

type CharacterNameProps = {
  character: CharacterState;
  handleNameChange: (newName: string) => void;
  validation: CharacterLocalState['validation'];
};

export const CharacterName = ({
  character,
  validation,
  handleNameChange,
}: CharacterNameProps) => {
  return (
    <CardContent>
      {character.isEditing ? (
        <TextField
          error={validation.name}
          helperText={
            !validation.name ? '' : 'Name be at least 2 characters long'
          }
          defaultValue={character.name}
          id="outlined-basic"
          label="Your name"
          onChange={(
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ): void => handleNameChange(event.target.value)}
          variant="outlined"
        />
      ) : (
        <Typography gutterBottom variant="h5" component="div">
          {character.name}
        </Typography>
      )}
    </CardContent>
  );
};
