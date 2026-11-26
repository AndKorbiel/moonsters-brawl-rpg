import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useGameOver, useGameStart } from "../hooks";
import { LifeBar } from "./ui/LifeBar";
import { colors, px } from "../theme/tokens";
import { AppState, CharacterState, OpponentState } from "../types";

export type LocalFightLogicState = {
  fightWon: boolean;
  hero: CharacterState | null;
  opponent: OpponentState | null;
  heroIsStarting: number;
  activePlayer: boolean;
  isFighting: boolean;
  logger: FightLogEntry[];
  previousOpponent: string;
};

export type FightLogEntry = {
  message: string;
  actor: "player" | "opponent" | "system";
};

const FIGHT_LOG_MAX_LINES = 10;
const FIGHT_LOG_LINE_HEIGHT = 16;
const FIGHT_LOG_GAP = 4;
const FIGHT_LOG_PADDING = 6;
const FIGHT_LOG_BORDER = 1;
const FIGHT_LOG_MAX_HEIGHT = px(
  FIGHT_LOG_MAX_LINES * FIGHT_LOG_LINE_HEIGHT +
    (FIGHT_LOG_MAX_LINES - 1) * FIGHT_LOG_GAP +
    2 * FIGHT_LOG_PADDING +
    2 * FIGHT_LOG_BORDER,
);

type FightLogicContainerProps = {
  heroStarts: boolean;
  fightStarted: boolean;
  onStartFight: () => void;
};

export const FightLogicContainer = ({
  heroStarts,
  fightStarted,
  onStartFight,
}: FightLogicContainerProps) => {
  const { character, opponent, opponentIsReaady } = useSelector(
    (state: AppState) => ({
      character: state.character,
      opponent: state.opponent,
      opponentIsReaady: state.opponent.isReady,
    }),
  );

  const iniitialState: LocalFightLogicState = {
    fightWon: false,
    hero: null,
    opponent: null,
    heroIsStarting: heroStarts ? 1 : 0,
    activePlayer: false,
    isFighting: true,
    logger: [],
    previousOpponent: "",
  };

  const getLifePoints = (player: CharacterState | OpponentState) => {
    if (player) {
      return player.stats.filter((el) => el.name === "life")[0].value;
    }
  };

  const maxHeroLife = getLifePoints(character) ?? 0;
  const maxOpponentLife = getLifePoints(opponent) ?? 0;

  const logRef = useRef<HTMLUListElement>(null);
  const [localState, setLocalState] = useState(iniitialState);
  const [gameIsReady, setGameIsReady] = useState(false);
  const [isFightOver, setIsFightIsOver] = useState(false);
  const heroName = localState.hero?.name ?? character.name;
  const opponentName = localState.opponent?.name ?? opponent.name;

  const { handleGameStart } = useGameStart({
    state: localState,
    isFightOver,
    setState: setLocalState,
    setIsFightIsOver,
  });

  const { handleFightOverState } = useGameOver({
    state: localState,
    setState: setLocalState,
    setGameIsReady,
    setIsFightIsOver,
    iniitialState,
  });

  useEffect(() => {
    if (fightStarted && opponentIsReaady) {
      setGameIsReady(true);

      setLocalState((currentState) => ({
        ...currentState,
        hero: { ...character },
        opponent: { ...opponent },
        heroIsStarting: heroStarts ? 1 : 0,
        activePlayer: heroStarts,
      }));
    }
  }, [character, fightStarted, heroStarts, opponent, opponentIsReaady]);

  useEffect(() => {
    if (gameIsReady) {
      handleGameStart();
    }
  }, [handleGameStart, gameIsReady]);

  useEffect(() => {
    const log = logRef.current;
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }, [localState.logger.length]);

  const firstAttacker = heroStarts
    ? (localState.hero?.name ?? character.name)
    : (localState.opponent?.name ?? opponent.name);
  const willAttackFirstLabel = firstAttacker
    ? `${firstAttacker} will attack first.`
    : "Waiting for opponent...";

  if (fightStarted && !gameIsReady) return <h1>Loading...</h1>;

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        minHeight: 0,
        flexDirection: "column",
        gap: px(6),
      }}
    >
      {[
        {
          label: heroName ? `${heroName}'s life points:` : "Your life points:",
          value: getLifePoints(localState.hero ?? character) ?? 0,
          max: maxHeroLife,
          color: colors.hpFull,
        },
        {
          label: opponentName
            ? `${opponentName}'s life points:`
            : "Your opponent life points:",
          value: getLifePoints(localState.opponent ?? opponent) ?? 0,
          max: maxOpponentLife,
          color: colors.dangerText,
        },
      ].map(({ label, value, max, color }) => (
        <Box
          key={label}
          sx={{
            display: "grid",
            gridTemplateColumns: `minmax(0, 1fr) ${px(66)} auto`,
            alignItems: "center",
            gap: px(4),
            minHeight: px(16),
          }}
        >
          <Typography
            component="span"
            variant="body1"
            sx={{ color: colors.labelKey, overflowWrap: "anywhere" }}
          >
            {label}
          </Typography>
          <LifeBar value={value} max={max} color={color} />
          <Typography
            component="span"
            variant="body1"
            sx={{
              minWidth: px(12),
              textAlign: "right",
              color: value < 0 ? colors.dangerText : colors.parchment,
            }}
          >
            {value}
          </Typography>
        </Box>
      ))}

      <Box
        component="ul"
        ref={logRef}
        aria-live="polite"
        sx={{
          display: "flex",
          flex: 1,
          minHeight: px(72),
          maxHeight: FIGHT_LOG_MAX_HEIGHT,
          flexDirection: "column",
          gap: px(FIGHT_LOG_GAP),
          m: 0,
          p: px(FIGHT_LOG_PADDING),
          overflowY: "auto",
          listStyle: "none",
          boxSizing: "border-box",
          border: `${px()} solid ${colors.outline}`,
          backgroundColor: colors.logBox,
          boxShadow: `inset 0 0 0 ${px()} ${colors.goldDark}, inset 0 0 0 ${px(2)} ${colors.outline}, inset ${px()} ${px()} 0 ${colors.insetShadow}`,
        }}
      >
        {[
          { message: willAttackFirstLabel, actor: "system" as const },
          ...localState.logger,
        ].map(({ message: line, actor }, index) => {
          const isWin = line === "You have won";
          const isPlayerAction = actor === "player";
          const damage = line.match(/^(.*? for )(\d+)$/);

          return (
            <Box
              component="li"
              key={`${index}-${line}`}
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: px(FIGHT_LOG_GAP),
                minHeight: px(FIGHT_LOG_LINE_HEIGHT),
                color: isWin
                  ? colors.gold
                  : isPlayerAction
                    ? colors.goldMid
                    : colors.parchment,
                lineHeight: px(16),
                overflowWrap: "anywhere",
              }}
            >
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  width: px(3),
                  height: px(5),
                  flexShrink: 0,
                  backgroundColor: isWin ? colors.ember : colors.goldMid,
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  alignSelf: "center",
                }}
              />
              <Typography
                component="span"
                variant="h6"
                sx={{
                  color: "inherit",
                  lineHeight: px(FIGHT_LOG_LINE_HEIGHT),
                  overflowWrap: "anywhere",
                }}
              >
                {damage ? (
                  <>
                    {damage[1]}
                    <Box
                      component="span"
                      sx={{
                        color: isPlayerAction
                          ? colors.goldMid
                          : colors.damageText,
                      }}
                    >
                      {damage[2]}
                    </Box>
                  </>
                ) : (
                  line
                )}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {!fightStarted ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={onStartFight}
          sx={{
            alignSelf: "center",
            mt: "auto",
            width: px(92),
            minWidth: px(92),
            minHeight: px(20),
          }}
        >
          Start the brawl
        </Button>
      ) : !localState.isFighting ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleFightOverState}
          sx={{
            alignSelf: "center",
            mt: "auto",
            width: px(92),
            minWidth: px(92),
            minHeight: px(20),
          }}
        >
          Continue
        </Button>
      ) : null}
    </Box>
  );
};
