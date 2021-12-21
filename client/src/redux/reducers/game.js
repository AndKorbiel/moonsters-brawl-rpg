import {SET_STATUS_CODE, START_GAME} from "../types/game";

const initialState = {
    statusCode: 0,
    gameStarted: false,
    menuOptions: [
        {value: 1, label: "New Game"},
        {value: 2, label: "Save Game"},
        {value: 3, label: "Load Game"},
        {value: 4, label: "Quit"}
    ]
}

export default function game(state = initialState, action) {
    switch (action.type) {
        case SET_STATUS_CODE:
            return {
                ...state,
                statusCode: action.payload
            }
        case START_GAME:
            return {
                ...state,
                gameStarted: true,
                menuOptions: state.menuOptions.map((el, index) => {
                    if (index === 0) {
                        return {value: 1, label: "Resume"}
                    } else {
                        return el
                    }
                })
            }
        default:
            return state
    }
}