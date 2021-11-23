import MainMenu from "./components/MainMenu";
import { connect } from "react-redux";
import './styles/App.css';
import Navbar from "./components/Navbar";

function App(props) {
  return (
    <div className="App">
        <Navbar />
        <h1>{props.status}</h1>
        <MainMenu />
    </div>
  );
}

const MapStateToProps = state => {
    return {
        status: state.status
    }
}

export default connect(MapStateToProps, {})(App);
