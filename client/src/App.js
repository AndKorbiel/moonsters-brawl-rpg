import './styles/App.scss';
import React from 'react';
import {connect} from "react-redux";
import {setStatusCode, startGame} from './redux/actions/game';
import CharacterCard from "./components/CharacterCardContainer";
import ShopCard from "./components/ShopCard";

// material-ui
import Navbar from "./components/Navbar";
import MainMenu from "./components/MainMenu";
import Grid from '@mui/material/Grid';

class App extends React.Component {
    handleGameStatus = status => {
        console.log(status)
        if (status === 1) {
            this.props.startGame()
        }
        this.props.setStatusCode(status)
    }

    render() {
        return (
            <div className="App">
                <Navbar status={this.props.statusCode} action={this.props.setStatusCode}/>
                <Grid container maxWidth="xl" spacing={2} className="main-cont centered">
                    {this.props.statusCode === 0 ?
                        <Grid item xs={12}>
                            <MainMenu action={this.handleGameStatus} gameStarted={this.props.gameStarted} options={this.props.menuOptions} />
                        </Grid>
                        : <><Grid item xs={12} lg={3}>
                                <CharacterCard />
                            </Grid>
                        <Grid item xs={12} lg={9}>
                            <ShopCard />
                        </Grid></>
                    }

                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        statusCode: state.game.statusCode,
        gameStarted: state.game.gameStarted,
        menuOptions: state.game.menuOptions
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setStatusCode: statusCode => {dispatch(setStatusCode(statusCode))},
        startGame: () => {dispatch(startGame())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
