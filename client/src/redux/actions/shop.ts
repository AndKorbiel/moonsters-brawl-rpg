import {
  createInitialShopStock,
  rerollShopStock,
  restockShopStock,
} from "../../data/shopStock";
import type { ActionType, Item, ShopSlotId, ShopState } from "../../types";
import {
  BUY_FROM_SHOP,
  INITIALIZE_SHOP,
  REMOVE_FROM_SHOP,
  REROLL_SHOP,
  RESTOCK_SHOP,
} from "../constants/shop";

export function initializeShop(random: () => number = Math.random) {
  return {
    type: INITIALIZE_SHOP,
    payload: createInitialShopStock(random),
  } satisfies ActionType;
}

export function restockShop(
  shop: ShopState,
  random: () => number = Math.random,
) {
  return {
    type: RESTOCK_SHOP,
    payload: restockShopStock(shop, random),
  } satisfies ActionType;
}

export function rerollShop(
  shop: ShopState,
  random: () => number = Math.random,
) {
  return {
    type: REROLL_SHOP,
    payload: rerollShopStock(shop, random),
  } satisfies ActionType;
}

export function removeFromShop(slotId: ShopSlotId) {
  return {
    type: REMOVE_FROM_SHOP,
    payload: slotId,
  } satisfies ActionType;
}

export function buyFromShop(slotId: ShopSlotId, item: Item) {
  return {
    type: BUY_FROM_SHOP,
    payload: { slotId, item },
  } satisfies ActionType;
}
