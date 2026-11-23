import { createStore } from "redux";
import { describe, expect, it } from "vitest";
import { dropItem, calculateStatsFromItem } from "../redux/actions/character";
import {
  buyFromShop,
  initializeShop,
  rerollShop,
  restockShop,
} from "../redux/actions/shop";
import { rootReducer } from "../redux/reducers";
import { ShopSlotId } from "../types";

describe("shop reducer flow", () => {
  it("clears a purchased slot and lets the dropped item be bought again after restocking", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));
    const weaponSlot = store.getState().shop.slots.find(
      (slot) => slot.id === ShopSlotId.WEAPON_OR_OFF_HAND,
    )!;
    const item = weaponSlot.item!;

    store.dispatch(buyFromShop(weaponSlot.id, item));

    expect(store.getState().character.gold).toBe(20 - item.price);
    expect(store.getState().character.items).toEqual([item]);
    expect(store.getState().shop.purchaseMadeThisRound).toBe(true);
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
    expect(store.getState().shop.rerollUsedThisRound).toBe(false);
    expect(store.getState().shop.purchaseMadeThisRound).toBe(false);

    const restockedItem = store
      .getState()
      .shop.slots.find((slot) => slot.id === weaponSlot.id)?.item;
    expect(restockedItem?.id).toBe(item.id);

    store.dispatch(buyFromShop(weaponSlot.id, restockedItem!));
    expect(store.getState().character.items).toEqual([item]);
    expect(store.getState().character.gold).toBe(20 - item.price * 2);
  });

  it("allows one reroll per round and resets the restriction after restocking", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));

    expect(store.getState().shop.rerollUsedThisRound).toBe(false);
    expect(store.getState().shop.purchaseMadeThisRound).toBe(false);

    store.dispatch(rerollShop(store.getState().shop, () => 0));
    expect(store.getState().shop.rerollUsedThisRound).toBe(true);

    const afterReroll = store.getState();
    store.dispatch(rerollShop(afterReroll.shop, () => 0));
    expect(store.getState()).toBe(afterReroll);

    store.dispatch(restockShop(store.getState().shop, () => 0));
    expect(store.getState().shop.rerollUsedThisRound).toBe(false);
    expect(store.getState().shop.purchaseMadeThisRound).toBe(false);
  });

  it("blocks reroll after a shop purchase", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));
    const slot = store.getState().shop.slots[0];
    store.dispatch(buyFromShop(slot.id, slot.item!));

    const afterPurchase = store.getState();
    expect(afterPurchase.shop.purchaseMadeThisRound).toBe(true);

    store.dispatch(rerollShop(afterPurchase.shop, () => 0));
    expect(store.getState()).toBe(afterPurchase);
  });
});
