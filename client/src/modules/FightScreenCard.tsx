import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useDispatch, useSelector } from "react-redux";

import { FightLogicContainer } from "../components/FightLogicContainer";
import { PixelPanel } from "../components/ui/PixelPanel";
import { START_FIGHT } from "../redux/constants/game";
import { colors, px } from "../theme/tokens";
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
      color="secondary"
      sx={{
        width: px(92),
        minHeight: px(20),
        mx: "auto",
      }}
      onClick={() => dispatch({ type: START_FIGHT })}
    >
      Start the brawl
    </Button>
  );

  return (
    <PixelPanel
      sx={{
        height: "100%",
        minHeight: px(192),
        display: "flex",
        flexDirection: "column",
        gap: px(6),
        backgroundColor: colors.panel,
      }}
    >
      <Typography variant="h5" align="center">
        Level {currentLevel} - Fight for your life!
      </Typography>

      <Box
        aria-hidden="true"
        sx={{
          position: "relative",
          width: "100%",
          height: px(5),
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            width: "100%",
            height: px(),
            backgroundColor: colors.goldDark,
            boxShadow: `0 ${px()} 0 ${colors.outline}`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            left: "50%",
            width: px(5),
            height: px(5),
            backgroundColor: colors.goldMid,
            clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
            transform: "translateX(-50%)",
          },
        }}
      />

      {fightStarted ? (
        <FightLogicContainer />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {StartFightButton}
        </Box>
      )}
    </PixelPanel>
  );
}
