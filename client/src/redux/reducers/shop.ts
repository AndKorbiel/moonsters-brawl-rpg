import {
  ShopSlotId,
  type ActionType,
  type ShopState,
} from "../../types";
import { items } from "../../data/items";
import {
  BUY_FROM_SHOP,
  INITIALIZE_SHOP,
  REMOVE_FROM_SHOP,
  REROLL_SHOP,
  RESTOCK_SHOP,
} from "../constants/shop";

const initialState: ShopState = {
  itemCatalog: items,
  rerollUsedThisRound: false,
  purchaseMadeThisRound: false,
  slots: [
    { id: ShopSlotId.ARMOR, item: null, soldItem: null },
    { id: ShopSlotId.MAGIC, item: null, soldItem: null },
    { id: ShopSlotId.WEAPON_OR_OFF_HAND, item: null, soldItem: null },
  ],
};

export default function shop(state = initialState, action: ActionType) {
  switch (action.type) {
    case INITIALIZE_SHOP:
      return {
        ...state,
        slots: action.payload,
        rerollUsedThisRound: false,
        purchaseMadeThisRound: false,
      };
    case RESTOCK_SHOP:
      return {
        ...state,
        slots: action.payload,
        rerollUsedThisRound: false,
        purchaseMadeThisRound: false,
      };
    case REROLL_SHOP:
      if (state.rerollUsedThisRound || state.purchaseMadeThisRound) {
        return state;
      }
      return {
        ...state,
        slots: action.payload,
        rerollUsedThisRound: true,
      };
    case BUY_FROM_SHOP:
      return { ...state, purchaseMadeThisRound: true };
    case REMOVE_FROM_SHOP:
      return {
        ...state,
        slots: state.slots.map((slot) =>
          slot.id === action.payload
            ? { ...slot, item: null, soldItem: slot.item }
            : slot,
        ),
      };
    default: {
      return state;
    }
  }
}
