import { items } from "../../data/items";
import type { ActionType, ShopState } from "../../types";
import { REMOVE_FROM_SHOP } from "../constants/shop";

const initialState: ShopState = {
  availableItems: items,
};

export default function shop(state = initialState, action: ActionType) {
  switch (action.type) {
    case REMOVE_FROM_SHOP:
      return {
        ...state,
        availableItems: state.availableItems.filter(
          (el) => el.id !== action.payload.id,
        ),
      };
    default: {
      return state;
    }
  }
}
