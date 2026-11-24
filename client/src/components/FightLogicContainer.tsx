import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useGameOver, useGameStart } from '../hooks';
import { LifeBar } from './ui/LifeBar';
import { colors, px } from '../theme/tokens';
import { AppState, CharacterState, OpponentState } from '../types';

export type LocalFightLogicState = {
  fightWon: boolean;
  hero: CharacterState | null;
  opponent: OpponentState | null;
  heroIsStarting: number;
  activePlayer: boolean;
  isFighting: boolean;
  logger: string[];
  previousOpponent: string;
};

export const FightLogicContainer = () => {
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
    heroIsStarting: 0,
    activePlayer: false,
    isFighting: true,
    logger: [],
    previousOpponent: '',
  };

  const getLifePoints = (player: CharacterState | OpponentState) => {
    if (player) {
      return player.stats.filter((el) => el.name === 'life')[0].value;
    }
  };

  const maxHeroLife = getLifePoints(character) ?? 0;
  const maxOpponentLife = getLifePoints(opponent) ?? 0;

  const [localState, setLocalState] = useState(iniitialState);
  const [gameIsReady, setGameIsReady] = useState(false);
  const [isFightOver, setIsFightIsOver] = useState(false);

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
    if (opponentIsReaady) {
      setGameIsReady(true);
      const starting = Math.round(Math.random());

      setLocalState((currentState) => ({
        ...currentState,
        hero: { ...character },
        opponent: { ...opponent },
        heroIsStarting: starting,
        activePlayer: starting ? true : false,
      }));
    }
  }, [character, opponent, opponentIsReaady]);

  useEffect(() => {
    if (gameIsReady) {
      handleGameStart();
    }
  }, [handleGameStart, gameIsReady]);

  const willAttackFristLabel = useMemo(
    () =>
      `${
        localState.heroIsStarting === 1
          ? localState.hero?.name
          : localState.opponent?.name
      } will attack first.`,
    [localState],
  );

  if (!gameIsReady) return <h1>Loading...</h1>;

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        minHeight: 0,
        flexDirection: 'column',
        gap: px(6),
      }}
    >
      {[
        {
          label: 'Your life points:',
          value: getLifePoints(localState.hero) ?? 0,
          max: maxHeroLife,
          color: colors.hpFull,
        },
        {
          label: 'Your opponent life points:',
          value: getLifePoints(localState.opponent) ?? 0,
          max: maxOpponentLife,
          color: colors.dangerText,
        },
      ].map(({ label, value, max, color }) => (
        <Box
          key={label}
          sx={{
            display: 'grid',
            gridTemplateColumns: `minmax(0, 1fr) ${px(66)} auto`,
            alignItems: 'center',
            gap: px(4),
            minHeight: px(16),
          }}
        >
          <Typography
            component="span"
            variant="body1"
            sx={{ color: colors.labelKey, overflowWrap: 'anywhere' }}
          >
            {label}
          </Typography>
          <LifeBar value={value} max={max} color={color} />
          <Typography
            component="span"
            variant="body1"
            sx={{
              minWidth: px(12),
              textAlign: 'right',
              color: value < 0 ? colors.dangerText : colors.parchment,
            }}
          >
            {value}
          </Typography>
        </Box>
      ))}

      <Box
        component="ul"
        aria-live="polite"
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: px(72),
          maxHeight: px(72),
          flexDirection: 'column',
          gap: px(4),
          m: 0,
          p: px(6),
          overflowY: 'auto',
          listStyle: 'none',
          boxSizing: 'border-box',
          border: `${px()} solid ${colors.outline}`,
          backgroundColor: colors.logBox,
          boxShadow: `inset 0 0 0 ${px()} ${colors.goldDark}, inset 0 0 0 ${px(2)} ${colors.outline}, inset ${px()} ${px()} 0 ${colors.insetShadow}`,
        }}
      >
        {[willAttackFristLabel, ...localState.logger].map((line, index) => {
          const isWin = line === 'You have won';
          const damage = line.match(/^(.*? for )(\d+)$/);

          return (
            <Box
              component="li"
              key={`${index}-${line}`}
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: px(4),
                minHeight: px(16),
                color: isWin ? colors.gold : colors.parchment,
                lineHeight: px(16),
                overflowWrap: 'anywhere',
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
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                  alignSelf: 'center',
                }}
              />
              <Typography
                component="span"
                variant="h6"
                sx={{
                  color: 'inherit',
                  lineHeight: px(16),
                  overflowWrap: 'anywhere',
                }}
              >
                {damage ? (
                  <>
                    {damage[1]}
                    <Box component="span" sx={{ color: colors.damageText }}>
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

      {!localState.isFighting && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleFightOverState}
          sx={{
            alignSelf: 'center',
            mt: 'auto',
            width: px(92),
            minWidth: px(92),
            minHeight: px(20),
          }}
        >
          Continue
        </Button>
      )}
    </Box>
  );
};
