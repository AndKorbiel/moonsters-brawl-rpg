import { connect } from "react-redux";
import './styles/App.scss';
import Navbar from "./components/Navbar";
import { Container } from '@mui/material';
import Home from './views/Home';
import GameScreen from './views/GameScreen';

function App(props) {
  return (
    <div className="App">
        <Navbar status={props.status} />
        <Container className="main-cont">
            {props.status === 'In Main Menu' ? <Home /> : <GameScreen />}
        </Container>
    </div>
  );
}

const mapStateToProps = state => {
    return {
        status: state.status
    }
}

export default connect(mapStateToProps, {})(App);
