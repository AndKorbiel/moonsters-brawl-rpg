import {connect} from "react-redux";
import React from 'react';
import Grid from '@mui/material/Grid';
import {calculateFightStats, calculateLevelUp} from '../handlers/FightMath'
import {setStatusCode} from "../redux/actions/game";
import {GAME_OVER} from "../redux/types/game";
import {changeStats} from "../redux/actions/character";
import Button from "@mui/material/Button";
import {levelUp, resetStats} from "../redux/actions/opponent";
import setHighScore from "../handlers/SetHighScore";

class FightLogicContainer extends React.Component {
    state = {
        hero: false,
        opponent: false,
        heroIsStarting: false,
        activePlayer: 0,
        isFighting: true,
        logger: [],
    }

    componentDidMount() {
        const starting = Math.round(Math.random());

        this.setState({
            hero: {...this.props.character},
            opponent: {...this.props.opponent},
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
                    let fightWon = false;
                    let message = '';
                    if (!this.state.activePlayer) {
                        fightWon = true;
                        message = 'You have won';
                    } else {
                        message = 'You have lost!';
                    }
                    let logger = this.state.logger;
                    logger.push(message);

                    this.setState({
                        logger: logger,
                        isFighting: false,
                        fightWon: fightWon
                    })
                    clearInterval(gamePlay)
                }
            }, 300)
        }, 300)
    }

    getLifePoints = player => {
        if (player) {
            return player.stats.filter(el => el.name === 'life')[0].value
        }
    }

    handleFightOverState = () => {
        if (this.state.fightWon) {
            const calculateStats = calculateLevelUp(this.props);

            this.props.changeStats(calculateStats.currentStats);
            this.props.setStatusCode(1)
            this.props.opponentLevelUp(calculateStats.opponent)
        } else {
            this.props.gameOver();
            setHighScore(this.props.character);
            this.props.resetStats([
                {name: 'attack', value: 10},
                {name: 'defense', value: 10},
                {name: 'life', value: 10},
            ])
        }
    }

    render() {
        return (
            <Grid container maxWidth="xl" spacing={2} className="centered">
                <Grid item xs={6}>
                    <p><b>Your life points: {this.getLifePoints(this.state.hero)}</b></p>
                </Grid>
                <Grid item xs={6}>
                    <p><b>Your opponent life points: {this.getLifePoints(this.state.opponent)}</b></p>
                </Grid>
                <Grid item xs={12}>
                    {this.state.heroIsStarting === 1 ? this.state.hero.name : this.state.opponent.name} will attack first.
                    {this.state.logger.map((el, index) => {
                        return (
                            <p key={index}>{el}</p>
                        )
                    })}
                    {!this.state.isFighting ?
                        <Button variant="contained" color="error" onClick={this.handleFightOverState}>Continue</Button>
                        : ''
                    }
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

const mapDispatchToProps = dispatch => {
    return {
        setStatusCode: status => dispatch(setStatusCode(status)),
        changeStats: value => dispatch(changeStats(value)),
        opponentLevelUp: stats => dispatch(levelUp(stats)),
        resetStats: stats => dispatch(resetStats(stats)),
        gameOver: () => dispatch({type: GAME_OVER})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FightLogicContainer);