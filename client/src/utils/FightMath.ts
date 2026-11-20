import { LocalFightLogicState } from '../components';
import { CharacterState, OpponentState } from '../types';

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const damageMath = (
  calculateDamage: number,
  tempOpponentStats: OpponentState['stats'],
) => {
  const defensePoints =
    tempOpponentStats.find((stat) => stat.name === 'defense')?.value ?? 0;
  const blockChance = defensePoints / calculateDamage / 1.4;
  return Math.random() <= blockChance;
};

function applyDamage(
  currentPlayer: CharacterState,
  calculateDamage: number,
): CharacterState;
function applyDamage(
  currentPlayer: OpponentState,
  calculateDamage: number,
): OpponentState;
function applyDamage(
  currentPlayer: CharacterState | OpponentState,
  calculateDamage: number,
): CharacterState | OpponentState {
  return {
    ...currentPlayer,
    stats: currentPlayer.stats.map((stat) =>
      stat.name === 'life'
        ? { ...stat, value: stat.value - calculateDamage }
        : stat,
    ),
  };
}

export const calculateFightStats = (state: LocalFightLogicState) => {
  if (!state.hero || !state.opponent) return state;

  const currentPlayer = state.activePlayer ? state.hero : state.opponent;

  const currentAttackPoints =
    currentPlayer.stats.find((stat) => stat.name === 'attack')?.value ?? 0;

  const calculateDamage = randomIntFromInterval(
    currentAttackPoints / 1,
    currentAttackPoints * 1.4,
  );
  const damageWasBlocked = damageMath(calculateDamage, state.opponent.stats);
  let message: string;

  let hero = state.hero;
  let opponent = state.opponent;

  if (damageWasBlocked) {
    message = `${currentPlayer.name} has been blocked`;
  } else {
    if (state.activePlayer) {
      opponent = applyDamage(opponent, calculateDamage);
    } else {
      hero = applyDamage(hero, calculateDamage);
    }
    message = `${currentPlayer.name} has attacked for ${calculateDamage}`;
  }

  return {
    activePlayer: !state.activePlayer,
    hero,
    opponent,
    logger: [...state.logger, message],
  };
};

export const calculateLevelUp = ({
  player,
  opponent,
}: {
  player: CharacterState;
  opponent: OpponentState;
}) => {
  let currentPlayerStats = { ...player };
  let currentOpponentStats = { ...opponent };

  currentPlayerStats.level = currentPlayerStats.level + 1;
  currentPlayerStats.gold =
    currentPlayerStats.gold + 10 * currentPlayerStats.level;
  currentPlayerStats.points = 5;

  currentOpponentStats.points = 5 * currentOpponentStats.level;
  currentOpponentStats.level = currentOpponentStats.level + 1;

  return { currentPlayerStats, currentOpponentStats };
};
