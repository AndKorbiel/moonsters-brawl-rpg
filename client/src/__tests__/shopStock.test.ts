import { describe, expect, it } from "vitest";
import {
  createInitialShopSlots,
  normalizeShopState,
  rerollShopSlots,
  restockEmptyShopSlots,
} from "../data/shopStock";
import { items } from "../data/items";
import { ItemType, ShopSlotId } from "../types";

describe("shop stock selection", () => {
  it("selects armor, magic, and one item from the combined weapon/off-hand pool", () => {
    const slots = createInitialShopSlots(() => 0);

    expect(slots.map((slot) => slot.id)).toEqual([
      ShopSlotId.ARMOR,
      ShopSlotId.MAGIC,
      ShopSlotId.WEAPON_OR_OFF_HAND,
    ]);
    expect(slots[0].item?.type).toBe(ItemType.ARMOR);
    expect(slots[1].item?.type).toBe(ItemType.MAGIC);
    expect([
      ItemType.WEAPON,
      ItemType.OFF_HAND,
    ]).toContain(slots[2].item?.type);
  });

  it("keeps stocked items and refills empty slots with replacement", () => {
    const initialSlots = createInitialShopSlots(() => 0);
    const emptiedSlots = initialSlots.map((slot, index) =>
      index === 2 ? { ...slot, item: null } : slot,
    );
    const restocked = restockEmptyShopSlots(
      {
        itemCatalog: items,
        slots: emptiedSlots,
        rerollUsedThisRound: false,
        purchaseMadeThisRound: false,
      },
      () => 0,
    );

    expect(restocked[0].item).toBe(initialSlots[0].item);
    expect(restocked[1].item).toBe(initialSlots[1].item);
    expect(restocked[2].item?.id).toBe(initialSlots[2].item?.id);
  });

  it("rerolls slot items when alternatives exist", () => {
    const shop = {
      itemCatalog: items,
      slots: createInitialShopSlots(() => 0),
      rerollUsedThisRound: false,
      purchaseMadeThisRound: false,
    };
    const rerolled = rerollShopSlots(shop, () => 0);

    expect(rerolled[0].item?.id).not.toBe(shop.slots[0].item?.id);
    expect(rerolled[2].item?.id).not.toBe(shop.slots[2].item?.id);
  });

  it("converts legacy saved shop stock to the three-slot format", () => {
    const normalized = normalizeShopState({
      availableItems: [
        { id: 13 },
        { id: 2 },
        { id: 1 },
      ],
    });

    expect(normalized.slots.map((slot) => slot.item?.type)).toEqual([
      ItemType.ARMOR,
      ItemType.MAGIC,
      ItemType.OFF_HAND,
    ]);
  });
});
