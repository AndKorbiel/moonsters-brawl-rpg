import {
  ShopSlotId,
  type ActionType,
  type ShopState,
} from "../../types";
import { items } from "../../data/items";
import {
  INITIALIZE_SHOP,
  REMOVE_FROM_SHOP,
  RESTOCK_SHOP,
} from "../constants/shop";

const initialState: ShopState = {
  itemCatalog: items,
  slots: [
    { id: ShopSlotId.ARMOR, item: null },
    { id: ShopSlotId.MAGIC, item: null },
    { id: ShopSlotId.WEAPON_OR_OFF_HAND, item: null },
  ],
};

export default function shop(state = initialState, action: ActionType) {
  switch (action.type) {
    case INITIALIZE_SHOP:
    case RESTOCK_SHOP:
      return { ...state, slots: action.payload };
    case REMOVE_FROM_SHOP:
      return {
        ...state,
        slots: state.slots.map((slot) =>
          slot.id === action.payload ? { ...slot, item: null } : slot,
        ),
      };
    default: {
      return state;
    }
  }
}
