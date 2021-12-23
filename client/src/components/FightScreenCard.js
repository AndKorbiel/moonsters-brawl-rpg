// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { connect } from 'react-redux';
import {startFight} from "../redux/actions/game";
import {useEffect} from "react";

function FightScreenCard(props) {
    useEffect(()=> {
        console.log(props.fightStarted)
    })
    return (
        <Paper>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center">Fight for your life!</Typography>
                    {props.fightStarted !== true ?
                        <Button variant="contained" onClick={()=> props.startFight()}>Fight</Button>
                        : ''
                    }
                </Grid>
            </Grid>
        </Paper>
    )
}

const mapStateToProps = state => {
    return {
        fightStarted: state.game.fightStarted
    }
}

const mapDispatchToProps = dispatch => {
    return {
        startFight: () => {dispatch(startFight())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FightScreenCard);