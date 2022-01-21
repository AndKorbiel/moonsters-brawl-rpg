import React from 'react';
import MainMenu from "../components/MainMenu";
import {render, screen} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import {Provider} from "react-redux";
import {store} from "../redux/store";
import App from "../App";

const menuOptions= [
    {value: 1, label: "New Game"},
    {value: 5, label: "Save Game"},
    {value: 6, label: "Load Game"},
    {value: 7, label: "Quit"}
]

it('renders correctly with props', ()=> {
    render(<MainMenu options={menuOptions} />)
})

