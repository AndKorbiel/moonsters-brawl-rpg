import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
import { CharacterState } from "../../types";
import { CharacterLocalState } from "../../modules";
import { colors, fieldBorders, px } from "../../theme/tokens";

type CharacterNameProps = {
  character: CharacterState;
  handleNameChange: (newName: string) => void;
  validation: CharacterLocalState["validation"];
};

export const CharacterName = ({
  character,
  validation,
  handleNameChange,
}: CharacterNameProps) => {
  return (
    <CardContent
      sx={{
        px: px(4),
        pt: px(8),
        pb: px(2),
        "&:last-child": { pb: px(2) },
      }}
    >
      {character.isEditing && character.level === 1 ? (
        <TextField
          fullWidth
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
          sx={{
            "& .MuiInputLabel-root": { color: colors.gold, fontSize: 24 },
            "& .MuiInputLabel-root.Mui-focused": { color: colors.ember },
            "& .MuiInputLabel-root.Mui-error": { color: colors.dangerText },
            "& .MuiInputLabel-root.Mui-disabled": {
              color: fieldBorders.disabled,
            },
            "& .MuiOutlinedInput-root": {
              height: px(24),
              caretColor: colors.ember,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: fieldBorders.default,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: fieldBorders.hover,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: fieldBorders.focus,
              },
              "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                borderColor: fieldBorders.error,
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor: fieldBorders.disabled,
              },
            },
            "& .MuiOutlinedInput-input": {
              px: px(5),
              py: px(2),
              color: colors.parchment,
              fontSize: 28,
            },
            "& .MuiFormHelperText-root": {
              mt: px(2),
              fontSize: 14,
            },
          }}
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
