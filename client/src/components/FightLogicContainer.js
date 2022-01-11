import {connect} from "react-redux";
import React from 'react';
import Grid from '@mui/material/Grid';
import {calculateFightStats} from '../handlers/FightMath'

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

        setTimeout(() => {
            const gamePlay = setInterval(() => {
                if (this.state.hero.stats.filter(el => el.name === 'life')[0].value > 0 && this.state.opponent.stats.filter(el => el.name === 'life')[0].value > 0) {
                    const results = calculateFightStats(this.state)
                    this.setState(state => ({
                        ...state,
                        activePlayer: !state.activePlayer,
                        hero: results.hero,
                        opponent: results.opponent,
                        logger: results.logger
                    }))
                } else {
                    let message = !this.state.activePlayer ? 'You have won' : 'You have lost!'
                    let logger = this.state.logger;
                    logger.push(message);

                    this.setState({
                        logger: logger
                    })
                    clearInterval(gamePlay)
                }
            }, 1500)
        }, 2000)
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
                            <p key={index}>{el}</p>
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