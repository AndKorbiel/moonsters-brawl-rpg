const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const damageMath = (calculateDamage, tempOpponentStats) => {
    let defensePoints = tempOpponentStats.stats.filter(el => el.name === 'defense')[0].value
    let lifePoints = tempOpponentStats.stats.filter(el => el.name === 'life')[0].value

    let blockChance = (defensePoints / calculateDamage) / 1.4;
    let random = Math.random();

    if (random > blockChance) {
        return {
            userTempLifePoints : lifePoints - calculateDamage,
            defensePoints : defensePoints,
            block: false
        }
    } else {
        return  {
            userTempDefencePoints : defensePoints,
            lifePoints : lifePoints,
            block: true
        }
    }
};

const calculateLifePoints = (player, currentAttack) => {
    player.stats = player.stats.map(el => {
        if (el.name === 'life') {
            return {name: 'life', value: el.value - currentAttack}
        } else {
            return el
        }
    })
}

export const calculateFightStats = state => {
    let tempHeroStats = state.hero;
    let tempOpponentStats = state.opponent;
    let currentPlayer = state.activePlayer === true ? state.hero : state.opponent;
    let currentAttackPoints = currentPlayer.stats.filter(el => el.name === 'attack')[0].value;
    let calculateDamage = random(currentAttackPoints / 1, currentAttackPoints * 1.4);
    let damageDone = damageMath(calculateDamage, tempOpponentStats);
    let logger = state.logger;
    let message;

    if (damageDone.block) {
        message = `${currentPlayer.name} has been blocked`;

    } else {
        if (currentPlayer === state.hero) {
            calculateLifePoints(tempOpponentStats, calculateDamage)
        } else {
            calculateLifePoints(tempHeroStats, calculateDamage)
        }
        message = `${currentPlayer.name} has attacked for ${calculateDamage}`;
    }

    logger.push(message);

    return {
        activePlayer: !state.activePlayer,
        hero: tempHeroStats,
        opponent: tempOpponentStats,
        logger
    }
}