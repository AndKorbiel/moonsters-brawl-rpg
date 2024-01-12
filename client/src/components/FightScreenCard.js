import { useDispatch, useSelector } from 'react-redux';
import FightLogicContainer from './FightLogicContainer';
import { START_FIGHT } from '../redux/types/game';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

export default function FightScreenCard() {
  const dispatch = useDispatch();
  const { fightStarted } = useSelector((state) => state.game.fightStarted);

  return (
    <Paper>
      <Grid container className="padlr">
        <Grid item xs={12} spacing={2}>
          <Typography variant="h5" align="center">
            Fight for your life!
          </Typography>

          {fightStarted !== true ? (
            <Button
              variant="contained"
              color="error"
              onClick={() => dispatch({ type: START_FIGHT })}
            >
              Fight
            </Button>
          ) : (
            <FightLogicContainer />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
