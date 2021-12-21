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
import OpponentCard from "./components/OpponentCard";

class App extends React.Component {
    handleGameStatus = status => {
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
                        : ''
                    }
                    {this.props.statusCode === 1 ?
                        <><Grid item xs={12} lg={3}>
                            <CharacterCard />
                        </Grid>
                            <Grid item xs={12} lg={9}>
                                <ShopCard />
                            </Grid></>
                        : ''
                    }
                    {this.props.statusCode === 2 ?
                        <>
                            <Grid item xs={12} lg={3}>
                                <CharacterCard />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <ShopCard />
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <OpponentCard />
                            </Grid>
                        </>
                        : ''
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
