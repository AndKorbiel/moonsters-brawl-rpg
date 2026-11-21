import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { useDispatch, useSelector } from "react-redux";

import { FightLogicContainer } from "../components/FightLogicContainer";
import { START_FIGHT } from "../redux/constants/game";
import { AppState } from "../types";

export function FightScreenCard() {
  const dispatch = useDispatch();
  const { currentLevel, fightStarted } = useSelector((state: AppState) => ({
    currentLevel: state.character.level,
    fightStarted: state.game.fightStarted,
  }));

  const StartFightButton = (
    <Button
      variant="contained"
      color="error"
      sx={{ display: "block", mx: "auto", mt: 4 }}
      onClick={() => dispatch({ type: START_FIGHT })}
    >
      Start the brawl
    </Button>
  );

  return (
    <Paper sx={{ height: '100%' }}>
      <Grid container className="padlr">
        <Grid size={12}>
          <Typography variant="h5" align="center">
            Level {currentLevel} - Fight for your life!
          </Typography>

          {fightStarted ? <FightLogicContainer /> : StartFightButton}
        </Grid>
      </Grid>
    </Paper>
  );
}
