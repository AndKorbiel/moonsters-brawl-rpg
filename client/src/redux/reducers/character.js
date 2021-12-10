const initialState = {
    name: 'Moonster',
    image: 'assets/images/frank.png',
    stats: [
        {name: 'attack', value: 10},
        {name: 'defense', value: 10},
        {name: 'life', value: 10},
    ]
}

export default function character(state = initialState, action) {
    return state
}