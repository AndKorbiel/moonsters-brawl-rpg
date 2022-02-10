// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { connect } from 'react-redux';
import FightLogicContainer from './FightLogicContainer';
import {START_FIGHT} from "../redux/types/game";

function FightScreenCard(props) {
    return (
        <Paper>
            <Grid container className="padlr">
                <Grid item xs={12} spacing={2}>
                    <Typography variant="h5" align="center">Fight for your life!</Typography>
                    {props.fightStarted !== true ?
                        <Button variant="contained" color="error" onClick={()=> props.startFight()}>Fight</Button>
                        : <FightLogicContainer />
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
        startFight: () => {dispatch({type: START_FIGHT})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FightScreenCard);