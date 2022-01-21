import React from 'react';
import {getByTestId, getByText, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../App';
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import userEvent from "@testing-library/user-event";
import {queryByTestId} from '@testing-library/react'

const app = () => render(
    <Provider store={store}>
        <App/>
    </Provider>
)

it('runs without crashing', ()=> {
    app()
})

it('renders top bar', ()=> {
    const { getByText } = app()
    const el = getByText('Moonster Brawl RPG');
    expect(el).toBeInTheDocument();
})

it('renders main menu', ()=> {
    const {getByTestId} = app();
    const mainMenu = getByTestId('main-menu');
    expect(mainMenu).toBeInTheDocument()
})

it('hides main menu once option is clicked', ()=> {
    const {getByRole } = app();
    const newGameButton = screen.getByRole('menuitem', {name: /New game/i})
    expect(newGameButton).toBeInTheDocument()
    userEvent.click(newGameButton)
    expect(getByRole ('character-card')).toBeInTheDocument()
})