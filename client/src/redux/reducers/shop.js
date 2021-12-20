import { REMOVE_FROM_SHOP } from "../types/shop";

const initialState = {
    availableItems: [
        {
            id: 0,
            name: "Sword",
            image: 'assets/images/items/sword.jpg',
            price: 99,
            stats: [
                {name: 'attack', value: '10'}
            ]
        },
        {
            id: 1,
            name: "Shield",
            image: 'assets/images/items/shield.jpg',
            price: 99,
            stats: [
                {name: 'defense', value: '10'}
            ]
        },
        {
            id: 2,
            name: "Life potion",
            image: 'assets/images/items/lifepotion.jpg',
            price: 99,
            stats: [
                {name: 'life', value: '10'}
            ]
        },
    ]
}

export default function shop(state = initialState, action) {
    switch (action.type) {
        case REMOVE_FROM_SHOP:
            return {
                ...state,
                availableItems: state.availableItems.filter(el => el.id !== action.payload.id)
            }
        default: {
            return state
        }
    }
}