import { LocalFightLogicState } from '../components';
import { CharacterState, OpponentState } from '../types';

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const damageMath = (
  calculateDamage: number,
  tempOpponentStats: OpponentState['stats'],
) => {
  const defensePoints = tempOpponentStats.filter(
    (el) => el.name === 'defense',
  )[0].value;

  const lifePoints = tempOpponentStats.filter((el) => el.name === 'life')[0]
    .value;

  const blockChance = defensePoints / calculateDamage / 1.4;
  const random = Math.random();

  if (random > blockChance) {
    return {
      userTempLifePoints: lifePoints - calculateDamage,
      defensePoints: defensePoints,
      block: false,
    };
  }

  return {
    userTempDefencePoints: defensePoints,
    lifePoints: lifePoints,
    block: true,
  };
};

const calculateLifePoints = (
  currentPlayer: CharacterState | OpponentState,
  calculateDamage: number,
) => {
  currentPlayer.stats = currentPlayer.stats.map((el) => {
    if (el.name === 'life') {
      return { name: 'life', value: el.value - calculateDamage };
    } else {
      return el;
    }
  });
};

export const calculateFightStats = (state: LocalFightLogicState) => {
  const hero = state.hero;
  const opponent = state.opponent;
  const currentPlayer =
    state.activePlayer === true ? state.hero : state.opponent;

  const currentAttackPoints = currentPlayer.stats.filter(
    (el) => el.name === 'attack',
  )[0].value;

  const calculateDamage = randomIntFromInterval(
    currentAttackPoints / 1,
    currentAttackPoints * 1.4,
  );
  const damageDone = damageMath(calculateDamage, opponent.stats);
  const logger = state.logger;
  let message: string;

  if (damageDone.block) {
    message = `${currentPlayer.name} has been blocked`;
  } else {
    if (currentPlayer === state.hero) {
      calculateLifePoints(opponent, calculateDamage);
    } else {
      calculateLifePoints(hero, calculateDamage);
    }
    message = `${currentPlayer.name} has attacked for ${calculateDamage}`;
  }

  logger.push(message);

  return {
    activePlayer: !state.activePlayer,
    hero: hero,
    opponent: opponent,
    logger,
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
