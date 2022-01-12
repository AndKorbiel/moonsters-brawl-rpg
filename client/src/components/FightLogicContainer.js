import {connect} from "react-redux";
import React from 'react';
import Grid from '@mui/material/Grid';
import {calculateFightStats} from '../handlers/FightMath'
import {setStatusCode} from "../redux/actions/game";
import {changeStats} from "../redux/actions/character";
import Button from "@mui/material/Button";
import {levelUp} from "../redux/actions/opponent";

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
            }, 1500)
        }, 2000)
    }

    getLifePoints = player => {
        if (player) {
            return player.stats.filter(el => el.name === 'life')[0].value
        }
    }

    handleFightOverState = () => {
        if (this.state.fightWon) {
            let currentStats = {...this.props.character};
            let opponent = {...this.props.opponent}

            currentStats.level = currentStats.level + 1;
            currentStats.gold = currentStats.gold + (10 * currentStats.level);
            currentStats.points = 5;
            opponent.level = opponent.level + 1;
            opponent.points = opponent.points + (5 * opponent.level)

            this.props.changeStats(currentStats);
            this.props.setStatusCode(1)
            this.props.opponentLevelUp(opponent)
        } else {
            this.props.setStatusCode(1)
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
                    {!this.state.isFighting ?
                        <Button variant="outlined" onClick={this.handleFightOverState}>Continue</Button>
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
        opponentLevelUp: stats => dispatch(levelUp(stats))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FightLogicContainer);