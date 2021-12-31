const initialState = {
    name: 'Moonster',
    level: 1,
    image: 'assets/images/frank.png',
    stats: [
        {name: 'attack', value: 10},
        {name: 'defense', value: 10},
        {name: 'life', value: 15},
    ],
}

export default function opponent(state = initialState, action) {
    return state
}