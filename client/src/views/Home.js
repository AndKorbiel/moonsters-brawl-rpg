import React from 'react';
import MainMenu from "../components/MainMenu";

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Welcome in game</h1>
                <MainMenu />
            </div>
        )
    }
}