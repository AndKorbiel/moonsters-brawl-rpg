import { REMOVE_FROM_SHOP } from "../types/shop";

export function removeFromShop(item) {
  return {
    type: REMOVE_FROM_SHOP,
    payload: item
  }
}