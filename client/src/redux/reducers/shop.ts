import {
  ItemRarity,
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
import { DROP_ITEM } from "../constants/character";

const initialState: ShopState = {
  itemCatalog: items,
  rerollUsedThisRound: false,
  purchaseMadeThisRound: false,
  round: 1,
  magicAppearances: 0,
  magicAppearedThisRound: false,
  lastRareAppearanceRound: null,
  retiredRareItemIds: [],
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
        ...action.payload,
        rerollUsedThisRound: false,
        purchaseMadeThisRound: false,
      };
    case RESTOCK_SHOP:
      return {
        ...state,
        ...action.payload,
        rerollUsedThisRound: false,
        purchaseMadeThisRound: false,
      };
    case REROLL_SHOP:
      if (state.rerollUsedThisRound || state.purchaseMadeThisRound) {
        return state;
      }
      return {
        ...state,
        ...action.payload,
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
    case DROP_ITEM:
      if (action.payload.rarity !== ItemRarity.RARE) return state;
      return {
        ...state,
        retiredRareItemIds: state.retiredRareItemIds.includes(
          action.payload.id,
        )
          ? state.retiredRareItemIds
          : [...state.retiredRareItemIds, action.payload.id],
      };
    default: {
      return state;
    }
  }
}
