import { LocalFightLogicState } from '../components';
import { CharacterState, OpponentState } from '../types';

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const damageMath = (
  calculateDamage: number,
  defenderStats: CharacterState['stats'],
) => {
  const defensePoints =
    defenderStats.find((stat) => stat.name === 'defense')?.value ?? 0;
  const blockChance = defensePoints / (defensePoints + calculateDamage);
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
    Math.ceil(currentAttackPoints),
    Math.floor(currentAttackPoints * 1.4),
  );
  const defender = state.activePlayer ? state.opponent : state.hero;
  const damageWasBlocked = damageMath(calculateDamage, defender.stats);
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
    currentPlayerStats.gold + Math.min(5 * currentPlayerStats.level, 30);
  currentPlayerStats.points = 5;

  currentOpponentStats.points = 6;
  currentOpponentStats.level = currentOpponentStats.level + 1;

  return { currentPlayerStats, currentOpponentStats };
};
