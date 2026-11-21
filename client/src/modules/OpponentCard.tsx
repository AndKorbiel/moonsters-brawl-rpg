import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useCreateOpponent } from '../hooks';
import { STAT_LABELS } from '../constants/statLabels';

export function OpponentCard() {
  const { opponent } = useCreateOpponent();

  return (
    <Card sx={{ maxWidth: 345, height: '100%' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {opponent.name}
        </Typography>
      </CardContent>

      <CardMedia component="img" height="140" image={opponent.image} />

      <CardActions className="stats">
        <ul>
          {opponent.stats.map((stat) => (
            <li key={stat.name}>
              <Typography variant="h6">
                {STAT_LABELS[stat.name]}: {stat.value}
              </Typography>
            </li>
          ))}
        </ul>
      </CardActions>
    </Card>
  );
}
