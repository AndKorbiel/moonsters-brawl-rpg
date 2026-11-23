import { createStore } from "redux";
import { describe, expect, it } from "vitest";
import { dropItem, calculateStatsFromItem } from "../redux/actions/character";
import { initializeShop, restockShop, buyFromShop } from "../redux/actions/shop";
import { rootReducer } from "../redux/reducers";
import { ShopSlotId } from "../types";

describe("shop reducer flow", () => {
  it("clears a purchased slot and lets the dropped item be bought again after restocking", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));
    const initialState = store.getState();
    const weaponSlot = initialState.shop.slots.find(
      (slot) => slot.id === ShopSlotId.WEAPON_OR_OFF_HAND,
    )!;
    const item = weaponSlot.item!;

    store.dispatch(buyFromShop(weaponSlot.id, item));

    expect(store.getState().character.gold).toBe(20 - item.price);
    expect(store.getState().character.items).toEqual([item]);
    expect(
      store
        .getState()
        .shop.slots.find((slot) => slot.id === weaponSlot.id)?.item,
    ).toBeNull();

    const afterFirstPurchase = store.getState();
    store.dispatch(buyFromShop(weaponSlot.id, item));
    expect(store.getState()).toBe(afterFirstPurchase);

    store.dispatch(dropItem(item));
    store.dispatch(
      calculateStatsFromItem(
        item.stats.map((stat) => ({ ...stat, value: -stat.value })),
      ),
    );
    store.dispatch(restockShop(store.getState().shop, () => 0));

    const restockedItem = store
      .getState()
      .shop.slots.find((slot) => slot.id === weaponSlot.id)?.item;
    expect(restockedItem?.id).toBe(item.id);

    store.dispatch(buyFromShop(weaponSlot.id, restockedItem!));
    expect(store.getState().character.items).toEqual([item]);
    expect(store.getState().character.gold).toBe(20 - item.price * 2);
  });
});
