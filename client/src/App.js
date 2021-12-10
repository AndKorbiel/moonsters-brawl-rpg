import './styles/App.scss';
import React from 'react';
import {connect} from "react-redux";
import setStatusCode from './redux/actions';
// material-ui
import Navbar from "./components/Navbar";
import MainMenu from "./components/MainMenu";
import Grid from '@mui/material/Grid';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Navbar status={this.props.statusCode} action={this.props.setStatusCode}/>
                <Grid container maxWidth="xl" spacing={2} className="main-cont centered">
                    <Grid item xs={12}>
                        {this.props.statusCode === 0 ? <MainMenu action={this.props.setStatusCode} /> : '' }
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        statusCode: state.statusCode
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setStatusCode: statusCode => {dispatch(setStatusCode(statusCode))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
