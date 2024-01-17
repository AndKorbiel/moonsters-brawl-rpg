import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const CharacterStats = ({
  character,
  points,
  stats,
  handleStatsChange,
}) => {
  return (
    <CardActions className="stats">
      <ul>
        <li>
          <Typography variant="h6">Level: {character.level}</Typography>
        </li>
        <li>
          <Typography variant="h6">Gold: {character.gold}</Typography>
        </li>
        <li>
          <Typography variant="h6">Points to spend: {points}</Typography>
        </li>

        {character.stats.map((el) => (
          <li key={el.name}>
            {character.isEditing && (
              <Button
                variant="contained"
                name={el.name}
                onClick={(e) => handleStatsChange(e, 'decrement')}
              >
                -
              </Button>
            )}

            <Typography variant="h6">
              {`${el.name}: ${
                character.isEditing
                  ? stats.filter((item) => item.name === el.name)[0].value
                  : el.value
              }`}
            </Typography>

            {character.isEditing && (
              <Button
                variant="contained"
                name={el.name}
                onClick={(e) => handleStatsChange(e, 'increment')}
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
