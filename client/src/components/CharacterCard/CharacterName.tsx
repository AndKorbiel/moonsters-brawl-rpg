import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
import { CharacterState } from "../../types";
import { CharacterLocalState } from "../../modules";

type CharacterNameProps = {
  character: CharacterState;
  handleNameChange: (newName: string) => void;
  validation: CharacterLocalState["validation"];
};

const textFieldStyles = {
  "& .MuiFormLabel-root.MuiInputLabel-root": { color: "secondary.main" },
  "& .MuiInputLabel-root": { color: "secondary.main" },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "secondary.main",
  },
  "& .MuiInputLabel-root.Mui-error": { color: "error.main" },
  "& .MuiInputLabel-root.Mui-error.Mui-focused": {
    color: "error.main",
  },
  "& .MuiOutlinedInput-input": { color: "secondary.main" },
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "secondary.main",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "secondary.main",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "secondary.main",
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline, &.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline":
      { borderColor: "error.main" },
  },
};

export const CharacterName = ({
  character,
  validation,
  handleNameChange,
}: CharacterNameProps) => {
  return (
    <CardContent>
      {character.isEditing && character.level === 1 ? (
        <TextField
          error={validation.name}
          helperText={
            !validation.name ? "" : "Name be at least 2 characters long"
          }
          defaultValue={character.name}
          id="outlined-basic"
          label="Your name"
          onChange={(
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ): void => handleNameChange(event.target.value)}
          sx={textFieldStyles}
          variant="outlined"
          color="secondary"
        />
      ) : (
        <Typography gutterBottom variant="h5" component="div">
          {character.name}
        </Typography>
      )}
    </CardContent>
  );
};
