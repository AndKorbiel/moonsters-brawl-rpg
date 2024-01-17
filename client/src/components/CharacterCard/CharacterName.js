import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export const CharacterName = ({ character, validation, handleNameChange }) => {
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
          onChange={(e) => handleNameChange(e)}
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
