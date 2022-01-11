const initialState = {
    name: 'Slayer',
    level: 1,
    image: 'assets/images/frank.png',
    stats: [
        {name: 'attack', value: 10},
        {name: 'defense', value: 10},
        {name: 'life', value: 115},
    ],
}

export default function opponent(state = initialState, action) {
    return state
}