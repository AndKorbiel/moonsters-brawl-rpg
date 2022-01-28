import React from 'react';
import {getByTestId, getByText, render, screen, queryByRole, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../App';
import { Provider } from 'react-redux'
import { store } from '../redux/store'

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
    app();
    const newGameButton = screen.getByRole('button', {name: /New game/i})
    expect(newGameButton).toBeInTheDocument()
    fireEvent.click(newGameButton)
    expect(screen.getByText('Welcome in Magic Shop')).toBeInTheDocument()
})

it('returns to main menu once munu button is clicked', ()=> {
    app()
    const mainMenuButton = screen.getByRole('button', {name: /MENU/i});
    expect(mainMenuButton).toBeInTheDocument()
    fireEvent.click(mainMenuButton)
    expect(screen.getByTestId('main-menu')).toBeInTheDocument()
})