import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useCreateOpponent } from '../hooks';

export function OpponentCard() {
  const { opponent, opponentStats } = useCreateOpponent();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {opponent.name}
        </Typography>
      </CardContent>

      <CardMedia component="img" height="140" image={opponent.image} />

      <CardActions className="stats">
        <ul>
          <li>
            <Typography variant="h6">Level: {opponent.level}</Typography>
          </li>
          {opponentStats &&
            opponentStats.map((el) => {
              return (
                <li key={el.name}>
                  <Typography variant="h6">
                    {el.name}: {el.value}
                  </Typography>
                </li>
              );
            })}
        </ul>
      </CardActions>
    </Card>
  );
}
