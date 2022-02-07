import React from 'react';
import MainMenu from "../components/MainMenu/MainMenu";
import {render } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderer from 'react-test-renderer'

const menuOptions= [
    {value: 1, label: "New Game"},
    {value: 5, label: "Save Game"},
    {value: 6, label: "Load Game"},
    {value: 7, label: "Quit"}
]

it('renders correctly with props', ()=> {
    render(<MainMenu options={menuOptions} />)
})

it('matches snapshot 1', ()=> {
    const domTree = renderer
        .create(<MainMenu options={menuOptions} />)
        .toJSON()
    expect(domTree).toMatchSnapshot();
})

it('matches snapshot 2', ()=> {
    const menuOptions = [{value: 1, label: "New Game"}, {value: 5, label: "Save Game"}]
    const tree = renderer
        .create(<MainMenu options={menuOptions} />)
        .toJSON()
    expect(tree).toMatchSnapshot()
})
