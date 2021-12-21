import {connect} from "react-redux";
import React from 'react';
import {handleEditMode, setNewName, changeStats, dropItem, calculateStatsFromItem} from "../redux/actions/character";
import CharacterCardDisplay from "./CharacterCardDisplay";
import Grid from '@mui/material/Grid';
import {setStatusCode} from "../redux/actions/game";

class CharacterCardContainer extends React.Component {
    state = {
        validation: {
            name: false
        }
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
        })
    }

    handleStatsChange = (e, option) => {
        const name = e.target.name;
        let currentStat = this.state.stats.filter(el => el.name === name)[0].value;
        let currentPoints = this.state.points;
        const statisticValueFromStore = this.props.character.stats.filter(el => el.name === name)[0].value;

        const updateState = () => {
            let action = "+";
            if (option === 'decrement') { action = '-'}

            this.setState(state => ({
                ...state,
                stats: [
                    ...state.stats.map(el => {
                        if (el.name === name) {
                            return {name, value: currentStat + parseFloat(action + 1)}
                        } else {
                            return el
                        }
                    })
                ],
                points: currentPoints - parseFloat(action + 1)
            }))
        }

        if (option === 'increment') {
            if (currentPoints > 0) {
                updateState()
            }
        } else {
            if (currentStat > statisticValueFromStore) {
                updateState()
            }
        }

    }

    handleSave = () => {
        if (this.state.name.length >= 2) {
            this.props.setNewName(this.state.name);
            this.props.handleEditMode(false);
            this.props.changeStats({stats: this.state.stats, points: this.state.points});

            this.setState(state => ({
                ...state,
                validation: {
                    ...state.validation,
                    name: false
                }
            }))
        } else {
            this.setState(state => ({
                ...state,
                validation: {
                    ...state.validation,
                    name: true
                }
            }))
        }
    }

    handleDropItem = item => {
        this.props.dropItem(item);
        const itemWithReverseStats = [{name: item.stats[0].name, value: -item.stats[0].value}]
        this.props.calculateStatsFromItem(itemWithReverseStats);
    }

    componentDidMount() {
        const currentStats = this.props.character;

        this.setState({
            ...currentStats
        })
    }

    render() {
        let emptySpaceInInventory = [];
        for (let n = this.props.character.items.length; n <=2; n++) {
            emptySpaceInInventory.push( <Grid item xs={12} lg={4} className="inventory-box" key={n} />)
        }

        return (
            <CharacterCardDisplay
                character={this.props.character}
                validation={this.state.validation}
                points={this.state.points}
                stats={this.state.stats}
                handleNameChange={this.handleNameChange}
                handleStatsChange={this.handleStatsChange}
                handleEditMode={this.props.handleEditMode}
                handleSave={this.handleSave}
                handleDropItem={this.handleDropItem}
                setStatusCode={this.props.setStatusCode}
            />
        )
    }
    
}

const mapStateToProps = state => {
    return {
        character: state.character
    }
}

const mapDispatchToProps = dispatch => {
    return {
        handleEditMode: value => dispatch(handleEditMode(value)),
        setNewName: newName => dispatch(setNewName(newName)),
        changeStats: value => dispatch(changeStats(value)),
        dropItem: item => dispatch(dropItem(item)),
        calculateStatsFromItem: item => dispatch(calculateStatsFromItem(item)),
        setStatusCode: statusCode => dispatch(setStatusCode(statusCode))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterCardContainer)