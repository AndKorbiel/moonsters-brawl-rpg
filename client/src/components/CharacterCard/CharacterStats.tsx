import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CharacterState } from '../../types';
import { CharacterLocalState } from '../../modules';
import { STAT_LABELS } from '../../constants/statLabels';

type CharacterStatsProps = {
  character: CharacterState;
  handleStatsChange: (name: string, option: string) => void;
  showGold: boolean;
  showLevel: boolean;
  points: CharacterLocalState['points'];
  stats: CharacterLocalState['stats'];
};

export const CharacterStats = ({
  character,
  points,
  stats,
  showGold,
  showLevel,
  handleStatsChange,
}: CharacterStatsProps) => {
  return (
    <CardActions className="stats">
      <ul>
        {showLevel && (
          <li>
            <Typography variant="h6">Level: {character.level}</Typography>
          </li>
        )}
        {showGold && (
          <li>
            <Typography variant="h6">Gold: {character.gold}</Typography>
          </li>
        )}
        {character.isEditing && (
          <li>
            <Typography variant="h6">Points to spend: {points}</Typography>
          </li>
        )}

        {character.stats.map((el) => (
          <li key={el.name}>
            {character.isEditing && (
              <Button
                variant="contained"
                name={el.name}
                onClick={() => handleStatsChange(el.name, 'decrement')}
              >
                -
              </Button>
            )}

            <Typography variant="h6">
              {`${STAT_LABELS[el.name]}: ${
                character.isEditing
                  ? stats.filter((item) => item.name === el.name)[0].value
                  : el.value
              }`}
            </Typography>

            {character.isEditing && (
              <Button
                variant="contained"
                name={el.name}
                onClick={() => handleStatsChange(el.name, 'increment')}
              >
                +
              </Button>
            )}
          </li>
        ))}
      </ul>
    </CardActions>
  );
};
