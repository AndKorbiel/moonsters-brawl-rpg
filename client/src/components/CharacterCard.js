import {connect} from "react-redux";
import React from 'react';
import {handleEditMode, setNewName, changeStats} from "../redux/actions/character";

// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

class CharacterCard extends React.Component {
    state = {
        name: '',
        points: 0,
        attack: 0,
        defense: 0,
        life: 0,
        validation: {
            name: false
        }
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
        })
    }

    handleIncrement = e => {
        const name = e.target.name;
        let current = this.state[name];

        this.setState(state => ({
            ...state,
            [name]: ++current
        }))
    }

    handleDecrement = e => {
        const name = e.target.name;
        let current = this.state[name];

        this.setState(state => ({
            ...state,
            [name]: --current
        }))
    }

    handleSave = () => {
        if (this.state.name.length >= 2) {
            this.props.setNewName(this.state.name);
            this.props.handleEditMode(false);
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

    componentDidMount() {
        const currentStats = this.props.character;

        const currentAttack = currentStats.stats.filter(el => el.name === 'attack');
        const currentDefense = currentStats.stats.filter(el => el.name === 'defense');
        const currentLife = currentStats.stats.filter(el => el.name === 'life');

        console.log(currentLife)

        this.setState({
            points: currentStats.points,
            attack: currentAttack[0].value,
            defense: currentDefense[0].value,
            life: currentLife[0].value,
        })
    }

    render() {
        return (
            <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Name:
                    </Typography>
                    {this.props.character.isEditing ?
                        <TextField
                            error={this.state.validation.name}
                            helperText={!this.state.validation.name ? "" : "Name be at least 2 characters long"}
                            defaultValue={this.props.character.name}
                            id="outlined-basic"
                            label={this.props.character.name}
                            onChange={e => this.handleNameChange(e)} variant="outlined"
                        />
                        :
                        <Typography gutterBottom variant="h5" component="div">
                            {this.props.character.name}
                        </Typography>
                    }

                </CardContent>
                <CardMedia
                    component="img"
                    height="140"
                    image={this.props.character.image}
                />
                <CardActions className="stats">
                    <ul>
                        <li>
                            <Typography variant="h6">
                                Level: {this.props.character.level}
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="h6">
                                Points to spend: {this.props.character.points}
                            </Typography>
                        </li>
                        {this.props.character.stats.map(el => {
                            return (
                                <li key={el.name}>
                                    {this.props.character.isEditing ?
                                        <Button
                                            variant="outlined"
                                            name={el.name}
                                            onClick={e => this.handleDecrement(e)}
                                        >-</Button>
                                        : ''
                                    }
                                    <Typography variant="h6">
                                        {el.name}: {this.props.character.isEditing ? this.state[el.name] : el.value}
                                    </Typography>
                                    {this.props.character.isEditing ?
                                        <Button
                                            variant="outlined"
                                            name={el.name}
                                            onClick={e => this.handleIncrement(e)}
                                        >+</Button>
                                        : ''
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </CardActions>
                {this.props.character.isEditing ?
                    <Button variant="contained" onClick={() => this.handleSave()}>Save</Button>
                    : <Button variant="outlined" onClick={() => this.props.handleEditMode(true)}>Edit</Button>
                }
            </Card>
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
        changeStats: value => dispatch(changeStats(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterCard)