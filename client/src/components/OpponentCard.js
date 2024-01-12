import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import { setImage } from '../redux/actions/opponent';
import { getNewNameEffect } from '../redux/effects/opponent';
// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function OpponentCard() {
  const dispatch = useDispatch();
  const { opponent } = useSelector((state) => ({
    opponent: state.opponent,
  }));

  let [opponentStats, setStats] = useState();
  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const handleSetStats = useMemo(() => {
    const points = opponent.points;
    const stats = opponent.stats.map((el) => el);

    for (let n = points; n > 0; n--) {
      const random = randomIntFromInterval(0, 2);
      switch (random) {
        case 0:
          stats.filter((el) => el.name === 'attack')[0].value =
            stats.filter((el) => el.name === 'attack')[0].value + 1;
          break;
        case 1:
          stats.filter((el) => el.name === 'defense')[0].value =
            stats.filter((el) => el.name === 'defense')[0].value + 1;
          break;
        case 2:
          stats.filter((el) => el.name === 'life')[0].value =
            stats.filter((el) => el.name === 'life')[0].value + 1;
          break;
        default:
          break;
      }
    }
    setStats(stats);
  }, [opponent]);

  useEffect(() => {
    dispatch(getNewNameEffect());
    dispatch(setImage(randomIntFromInterval(1, 4)));
    handleSetStats();
  }, [dispatch, handleSetStats]);

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
