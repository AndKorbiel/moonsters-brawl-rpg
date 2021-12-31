import {connect} from "react-redux";
import React from 'react';
import Grid from '@mui/material/Grid';

class FightLogicContainer extends React.Component {
    state = {
        hero: false,
        opponent: false,
        heroIsStarting: false,
        activePlayer: 0,
        isFighting: true,
        logger: []
    }

    componentDidMount() {
        const starting = Math.round(Math.random());

        this.setState({
            hero: this.props.character,
            opponent: this.props.opponent,
            heroIsStarting: starting,
            activePlayer: starting ? true : false
        })

        setTimeout(()=> {
            this.calculateFightStats()
        }, 2000)
    }

    calculateLifePoints = (player, currentAttack) => {
        player.stats = player.stats.map(el => {
            if (el.name === 'life') {
                return {name: 'life', value: el.value - currentAttack}
            } else {
                return el
            }
        })
    }

    calculateFightStats = () => {
        for (let n = 10; n >= 0; n--) {
            let tempHeroStats = this.state.hero;
            let tempOpponentStats = this.state.opponent;
            let currentPlayer = this.state.activePlayer === true ? this.state.hero : this.state.opponent;
            let currentAttack = currentPlayer.stats.filter(el => el.name === 'attack')[0].value;
            let logger = this.state.logger;

            if (currentPlayer === this.state.hero) {
                this.calculateLifePoints(tempOpponentStats, currentAttack)
            } else {
                this.calculateLifePoints(tempHeroStats, currentAttack)
            }

            let message = `${currentPlayer.name} has attacked for ${currentAttack}`;
            logger.push(message);

            this.setState(state => {
                return {
                    ...state,
                    activePlayer: !state.activePlayer,
                    hero: tempHeroStats,
                    opponent: tempOpponentStats,
                    logger
                }
            })
        }
    }

    getLifePoints = player => {
        if (player) {
            return player.stats.filter(el => el.name === 'life')[0].value
        }
    }

    render() {

        return (
            <Grid container maxWidth="xl" spacing={2} className="main-cont centered">
                <Grid item xs={6}>
                    <p>Your life points: {this.getLifePoints(this.state.hero)}</p>
                </Grid>
                <Grid item xs={6}>
                    <p>Your opponent life points: {this.getLifePoints(this.state.opponent)}</p>
                </Grid>
                <Grid item xs={12}>
                    {this.state.heroIsStarting === 1 ? this.state.hero.name : this.state.opponent.name} will attack first.
                    {this.state.logger.map((el, index) => {
                        return (
                            <p key={el.index}>{el}</p>
                        )
                    })}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        character: state.character,
        opponent: state.opponent
    }
}

export default connect(mapStateToProps, null)(FightLogicContainer);