import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CharacterState } from '../../types';
import { CharacterLocalState } from '../../modules';
import { STAT_LABELS } from '../../constants/statLabels';

type CharacterStatsProps = {
  character: CharacterState;
  handleStatsChange: (name: string, amount: number) => void;
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
            <Typography variant="h6" sx={{ lineHeight: '18px' }}>
              <Box
                component="img"
                src="assets/images/gold-coins.svg"
                alt=""
                aria-hidden="true"
                sx={{ width: 18, height: 18, verticalAlign: 'bottom' }}
              />{' '}
              {character.gold}
            </Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Button
                  variant="contained"
                  size="small"
                  aria-label={`Remove 5 ${STAT_LABELS[el.name]} points`}
                  disabled={
                    (stats?.find((stat) => stat.name === el.name)?.value ??
                      el.value) -
                      el.value <
                    5
                  }
                  onClick={() => handleStatsChange(el.name, -5)}
                >
                  {'<<'}
                </Button>
                <Button
                  variant="contained"
                  name={el.name}
                  onClick={() => handleStatsChange(el.name, -1)}
                >
                  -
                </Button>
              </Box>
            )}

            <Typography variant="h6">
              {`${STAT_LABELS[el.name]}: ${
                character.isEditing
                  ? stats.filter((item) => item.name === el.name)[0].value
                  : el.value
              }`}
            </Typography>

            {character.isEditing && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Button
                  variant="contained"
                  name={el.name}
                  onClick={() => handleStatsChange(el.name, 1)}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  aria-label={`Add 5 ${STAT_LABELS[el.name]} points`}
                  disabled={(points ?? 0) < 5}
                  onClick={() => handleStatsChange(el.name, 5)}
                >
                  {'>>'}
                </Button>
              </Box>
            )}
          </li>
        ))}
      </ul>
    </CardActions>
  );
};
