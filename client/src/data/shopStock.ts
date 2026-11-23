import { items } from "./items";
import {
  ItemType,
  ShopSlotId,
  type Item,
  type ShopSlot,
  type ShopState,
} from "../types";

const slotIds = [
  ShopSlotId.ARMOR,
  ShopSlotId.MAGIC,
  ShopSlotId.WEAPON_OR_OFF_HAND,
];

function emptySlots(): ShopSlot[] {
  return slotIds.map((id) => ({ id, item: null, soldItem: null }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getCatalogItem(value: unknown) {
  if (!isRecord(value) || typeof value.id !== "number") {
    return null;
  }
  return items.find((item) => item.id === value.id) ?? null;
}

function getItemsForSlot(slotId: ShopSlotId, catalog: Item[] = items) {
  switch (slotId) {
    case ShopSlotId.ARMOR:
      return catalog.filter((item) => item.type === ItemType.ARMOR);
    case ShopSlotId.MAGIC:
      return catalog.filter((item) => item.type === ItemType.MAGIC);
    case ShopSlotId.WEAPON_OR_OFF_HAND:
      return catalog.filter(
        (item) =>
          item.type === ItemType.WEAPON || item.type === ItemType.OFF_HAND,
      );
  }
}

function pickItem(
  slotId: ShopSlotId,
  random: () => number,
  catalog: Item[] = items,
  previousItemId?: number,
) {
  const allCandidates = getItemsForSlot(slotId, catalog);
  const alternatives = allCandidates.filter(
    (item) => item.id !== previousItemId,
  );
  const candidates =
    alternatives.length > 0 ? alternatives : allCandidates;
  if (candidates.length === 0) {
    throw new Error(`No items available for shop slot: ${slotId}`);
  }

  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
    throw new Error(
      "Shop item selection requires a random value in the range [0, 1).",
    );
  }

  const index = Math.floor(sample * candidates.length);
  return candidates[index];
}

export function createInitialShopSlots(
  random: () => number = Math.random,
): ShopSlot[] {
  return slotIds.map((id) => ({
    id,
    item: pickItem(id, random),
    soldItem: null,
  }));
}

export function rerollShopSlots(
  shop: ShopState,
  random: () => number = Math.random,
): ShopSlot[] {
  return shop.slots.map((slot) => ({
    ...slot,
    item: pickItem(
      slot.id,
      random,
      shop.itemCatalog,
      slot.item?.id,
    ),
    soldItem: null,
  }));
}

export function normalizeShopState(value: unknown): ShopState {
  if (!isRecord(value)) {
    throw new Error("Invalid saved shop state.");
  }

  if (Array.isArray(value.slots)) {
    const savedSlots = value.slots;
    const slots = slotIds.map((id) => {
      const savedSlot = savedSlots.find(
        (slot) => isRecord(slot) && slot.id === id,
      );
      if (!isRecord(savedSlot)) {
        return { id, item: null, soldItem: null };
      }

      const item =
        savedSlot.item === null ? null : getCatalogItem(savedSlot.item);
      if (savedSlot.item !== null && !item) {
        throw new Error(`Invalid item in saved shop slot: ${id}`);
      }
      const soldItem =
        savedSlot.soldItem == null
          ? null
          : getCatalogItem(savedSlot.soldItem);
      if (savedSlot.soldItem != null && !soldItem) {
        throw new Error(`Invalid sold item in saved shop slot: ${id}`);
      }
      return { id, item, soldItem };
    });

    return {
      slots,
      itemCatalog: items,
      rerollUsedThisRound:
        value.rerollUsedThisRound === true,
      purchaseMadeThisRound:
        value.purchaseMadeThisRound === true ||
        (value.purchaseMadeThisRound === undefined &&
          slots.some((slot) => slot.item === null)),
    };
  }

  if (Array.isArray(value.availableItems)) {
    const savedItems = value.availableItems.map((savedItem) => {
      const item = getCatalogItem(savedItem);
      if (!item) {
        throw new Error("Invalid item in legacy saved shop stock.");
      }
      return item;
    });
    return {
      slots: emptySlots().map((slot) => ({
        ...slot,
        item:
          savedItems.find((item) =>
            slot.id === ShopSlotId.ARMOR
              ? item.type === ItemType.ARMOR
              : slot.id === ShopSlotId.MAGIC
                ? item.type === ItemType.MAGIC
                : item.type === ItemType.WEAPON ||
                  item.type === ItemType.OFF_HAND,
          ) ?? null,
      })),
      itemCatalog: items,
      rerollUsedThisRound: false,
      purchaseMadeThisRound: false,
    };
  }

  throw new Error("Invalid saved shop state.");
}

export function restockEmptyShopSlots(
  shop: ShopState,
  random: () => number = Math.random,
): ShopSlot[] {
  return shop.slots.map((slot) => ({
    ...slot,
    item: slot.item ?? pickItem(slot.id, random, shop.itemCatalog),
    soldItem: slot.item === null ? null : slot.soldItem,
  }));
}
