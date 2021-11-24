import { connect } from "react-redux";
import './styles/App.css';
import Navbar from "./components/Navbar";
import { Container } from '@mui/material';
import Home from './views/Home';

function App(props) {
  return (
    <div className="App">
        <Navbar status={props.status} />
        <Container className="main-cont">
            {props.status === 'In Main Menu' ? <Home /> : ''}
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
