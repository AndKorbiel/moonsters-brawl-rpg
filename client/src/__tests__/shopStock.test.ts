import { describe, expect, it } from "vitest";
import {
  createInitialShopStock,
  createInitialShopSlots,
  normalizeShopState,
  rerollShopStock,
  rerollShopSlots,
  restockShopStock,
  restockEmptyShopSlots,
} from "../data/shopStock";
import { items } from "../data/items";
import {
  ItemRarity,
  ItemType,
  ShopSlotId,
  type ShopState,
} from "../types";

function emptyShopAtRound(round: number): ShopState {
  return {
    itemCatalog: items,
    slots: createInitialShopSlots(() => 0).map((slot) => ({
      ...slot,
      item: null,
      soldItem: null,
    })),
    rerollUsedThisRound: false,
    purchaseMadeThisRound: false,
    round,
    magicAppearances: 0,
    magicAppearedThisRound: false,
    lastRareAppearanceRound: null,
    retiredRareItemIds: [],
  };
}

function clearStock(shop: ShopState): ShopState {
  return {
    ...shop,
    slots: shop.slots.map((slot) => ({
      ...slot,
      item: null,
      soldItem: null,
    })),
    magicAppearedThisRound: false,
  };
}

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

  it("uses the configured magic and rare chances after their unlock rounds", () => {
    const justBeforeMagic = restockShopStock(emptyShopAtRound(3), () => 0.01);
    const magicUnlock = restockShopStock(emptyShopAtRound(4), () => 0.19);
    const magicChanceBoundary = restockShopStock(
      emptyShopAtRound(4),
      () => 0.2,
    );
    const justBeforeRare = restockShopStock(emptyShopAtRound(8), () => 0.01);
    const rareUnlock = restockShopStock(emptyShopAtRound(9), () => 0.05);
    const rareChanceBoundary = restockShopStock(
      emptyShopAtRound(9),
      () => 0.1,
    );

    expect(
      justBeforeMagic.slots.some(
        (slot) => slot.item?.rarity === ItemRarity.MAGIC,
      ),
    ).toBe(false);
    expect(
      magicUnlock.slots.some(
        (slot) => slot.item?.rarity === ItemRarity.MAGIC,
      ),
    ).toBe(true);
    expect(
      magicChanceBoundary.slots.some(
        (slot) => slot.item?.rarity === ItemRarity.MAGIC,
      ),
    ).toBe(false);
    expect(
      justBeforeRare.slots.some(
        (slot) => slot.item?.rarity === ItemRarity.RARE,
      ),
    ).toBe(false);
    expect(
      rareUnlock.slots.some(
        (slot) => slot.item?.rarity === ItemRarity.RARE,
      ),
    ).toBe(true);
    expect(
      rareChanceBoundary.slots.some(
        (slot) => slot.item?.rarity === ItemRarity.RARE,
      ),
    ).toBe(false);
  });

  it("limits magic items to one per round and three appearances per game", () => {
    let shop = emptyShopAtRound(4);
    let totalMagicOffers = 0;

    for (let round = 5; round <= 9; round += 1) {
      const stock = restockShopStock(shop, () => 0);
      const magicOffers = stock.slots.filter(
        (slot) => slot.item?.rarity === ItemRarity.MAGIC,
      );

      expect(magicOffers).toHaveLength(round <= 7 ? 1 : 0);
      totalMagicOffers += magicOffers.length;
      shop = clearStock({ ...shop, ...stock });
    }

    expect(totalMagicOffers).toBe(3);
    expect(shop.magicAppearances).toBe(3);
  });

  it("counts a draft magic offer toward that round's limit during rerolls", () => {
    const draft = restockShopStock(emptyShopAtRound(4), () => 0);
    const rerolled = rerollShopStock(
      {
        ...emptyShopAtRound(draft.round),
        ...draft,
      },
      () => 0,
    );

    expect(
      draft.slots.some((slot) => slot.item?.rarity === ItemRarity.MAGIC),
    ).toBe(true);
    expect(
      rerolled.slots.some(
        (slot) => slot.item?.rarity === ItemRarity.MAGIC,
      ),
    ).toBe(false);
    expect(rerolled.magicAppearances).toBe(1);
  });

  it("allows a reroll to use the round's magic offer when the draft had none", () => {
    const draft = restockShopStock(emptyShopAtRound(4), () => 0.9);
    const rerolled = rerollShopStock(
      {
        ...emptyShopAtRound(draft.round),
        ...draft,
      },
      () => 0,
    );

    expect(
      draft.slots.some((slot) => slot.item?.rarity === ItemRarity.MAGIC),
    ).toBe(false);
    expect(
      rerolled.slots.filter(
        (slot) => slot.item?.rarity === ItemRarity.MAGIC,
      ),
    ).toHaveLength(1);
    expect(rerolled.magicAppearances).toBe(1);
  });

  it("allows common items to reappear on later round drafts", () => {
    const firstDraft = restockShopStock(emptyShopAtRound(4), () => 0.9);
    const repeatedDraft = restockShopStock(
      clearStock({ ...emptyShopAtRound(firstDraft.round), ...firstDraft }),
      () => 0.9,
    );

    expect(firstDraft.slots[0].item?.rarity).toBe(ItemRarity.COMMON);
    expect(repeatedDraft.slots[0].item?.id).toBe(firstDraft.slots[0].item?.id);
  });

  it("allows rare offers no more often than once every three rounds", () => {
    let shop = emptyShopAtRound(9);
    const roundTen = restockShopStock(shop, () => 0.05);
    const roundEleven = restockShopStock(clearStock({ ...shop, ...roundTen }), () => 0.05);
    const roundTwelve = restockShopStock(
      clearStock({ ...shop, ...roundEleven }),
      () => 0.05,
    );
    const roundThirteen = restockShopStock(
      clearStock({ ...shop, ...roundTwelve }),
      () => 0.05,
    );

    const rareCount = (stock: typeof roundTen) =>
      stock.slots.filter((slot) => slot.item?.rarity === ItemRarity.RARE)
        .length;

    expect(rareCount(roundTen)).toBe(1);
    expect(rareCount(roundEleven)).toBe(0);
    expect(rareCount(roundTwelve)).toBe(0);
    expect(rareCount(roundThirteen)).toBe(1);
  });

  it("allows a currently stocked rare item to be selected again on reroll", () => {
    const rareItem = items.find(
      (item) => item.rarity === ItemRarity.RARE && item.type === ItemType.ARMOR,
    )!;
    const shop: ShopState = {
      ...emptyShopAtRound(10),
      slots: emptyShopAtRound(10).slots.map((slot) =>
        slot.id === ShopSlotId.ARMOR ? { ...slot, item: rareItem } : slot,
      ),
      lastRareAppearanceRound: 10,
      magicAppearances: 3,
    };

    const rerolled = rerollShopStock(shop, () => 0);

    expect(rerolled.slots[0].item?.id).toBe(rareItem.id);
  });

  it("persists rarity appearance limits when normalizing saved shop state", () => {
    const stock = createInitialShopStock(() => 0);
    const normalized = normalizeShopState(
      {
        slots: stock.slots,
        round: 12,
        magicAppearances: 3,
        magicAppearedThisRound: true,
        lastRareAppearanceRound: 10,
        retiredRareItemIds: [30],
      },
      12,
    );

    expect(normalized).toMatchObject({
      round: 12,
      magicAppearances: 3,
      magicAppearedThisRound: true,
      lastRareAppearanceRound: 10,
      retiredRareItemIds: [30],
    });
  });
});
