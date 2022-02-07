import './styles/App.scss';
// material-ui
import Navbar from "./components/Navbar";
import MainMenu from "./components/MainMenu/MainMenu";
import Grid from '@mui/material/Grid';

import React from 'react';
import {connect} from "react-redux";
import {setStatusCode} from './redux/actions/game';
import {START_GAME } from './redux/types/game';
import CharacterCard from "./components/CharacterCardContainer";
import ShopCard from "./components/ShopCard";
import OpponentCard from "./components/OpponentCard";
import FightScreenCard from "./components/FightScreenCard";
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore'
import LoadGame from "./components/MainMenu/LoadGame";
import SaveGame from "./components/MainMenu/SaveGame";

class App extends React.Component {
    gameCollectionRef = collection(db, 'games');

    handleGameStatus = status => {
        if (status === 1) {
            this.props.startGame()
        }
        this.props.setStatusCode(status)
    }

    componentDidMount() {
        const getGames = async () => {
            const data = await getDocs(this.gameCollectionRef)
            const formattedData = data.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            console.log(formattedData)
        }

        getGames()
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
                                <FightScreenCard />
                            </Grid>
                            <Grid item xs={12} lg={3}>
                                <OpponentCard />
                            </Grid>
                        </>
                        : ''
                    }
                    {this.props.statusCode === 5 ?
                        <SaveGame />
                        : ''
                    }
                    {this.props.statusCode === 6 ?
                        <LoadGame />
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
        startGame: () => {dispatch({type: START_GAME})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
