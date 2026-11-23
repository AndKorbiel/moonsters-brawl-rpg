import { items } from "./items";
import {
  ItemRarity,
  ItemType,
  ShopSlotId,
  type Item,
  type ShopSlot,
  type ShopState,
  type ShopStockResult,
} from "../types";

const slotIds = [
  ShopSlotId.ARMOR,
  ShopSlotId.MAGIC,
  ShopSlotId.WEAPON_OR_OFF_HAND,
];
const MAGIC_APPEARANCE_LIMIT = 3;
const MAGIC_START_ROUND = 5;
const RARE_START_ROUND = 10;
const RARE_COOLDOWN_ROUNDS = 3;
const MAGIC_CHANCE = 0.2;
const RARE_CHANCE = 0.1;

type AppearanceState = Pick<
  ShopStockResult,
  | "round"
  | "magicAppearances"
  | "magicAppearedThisRound"
  | "lastRareAppearanceRound"
  | "retiredRareItemIds"
>;

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

function getRandomIndex(length: number, random: () => number) {
  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
    throw new Error(
      "Shop item selection requires a random value in the range [0, 1).",
    );
  }
  return Math.floor(sample * length);
}

function pickItem(
  slotId: ShopSlotId,
  random: () => number,
  catalog: Item[],
  appearance: AppearanceState,
  previousItem?: Item | null,
  isReroll = false,
) {
  const allCandidates = getItemsForSlot(slotId, catalog).filter(
    (item) =>
      item.rarity !== ItemRarity.RARE ||
      !appearance.retiredRareItemIds.includes(item.id),
  );
  const isSameRareReroll =
    isReroll &&
    previousItem?.rarity === ItemRarity.RARE &&
    !appearance.retiredRareItemIds.includes(previousItem.id) &&
    appearance.lastRareAppearanceRound === appearance.round;
  const rareCandidates = isSameRareReroll
    ? allCandidates.filter((item) => item.id === previousItem?.id)
    : allCandidates.filter((item) => item.rarity === ItemRarity.RARE);
  const magicCandidates = allCandidates.filter(
    (item) => item.rarity === ItemRarity.MAGIC,
  );
  const commonCandidates = allCandidates.filter(
    (item) => item.rarity === ItemRarity.COMMON,
  );
  const rareAvailable =
    rareCandidates.length > 0 &&
    (isSameRareReroll ||
      (appearance.round >= RARE_START_ROUND &&
        (appearance.lastRareAppearanceRound === null ||
          appearance.round - appearance.lastRareAppearanceRound >=
            RARE_COOLDOWN_ROUNDS)));
  const magicAvailable =
    magicCandidates.length > 0 &&
    appearance.round >= MAGIC_START_ROUND &&
    appearance.magicAppearances < MAGIC_APPEARANCE_LIMIT &&
    !appearance.magicAppearedThisRound;

  const rarityRoll = random();
  if (!Number.isFinite(rarityRoll) || rarityRoll < 0 || rarityRoll >= 1) {
    throw new Error(
      "Shop item selection requires a random value in the range [0, 1).",
    );
  }

  let candidates = commonCandidates;
  if (rareAvailable && rarityRoll < RARE_CHANCE) {
    candidates = rareCandidates;
  } else if (
    magicAvailable &&
    rarityRoll < (rareAvailable ? RARE_CHANCE + MAGIC_CHANCE : MAGIC_CHANCE)
  ) {
    candidates = magicCandidates;
  }

  if (candidates.length === 0) {
    candidates = allCandidates.filter(
      (item) => item.rarity === ItemRarity.COMMON,
    );
  }
  if (candidates.length === 0) {
    throw new Error(`No items available for shop slot: ${slotId}`);
  }

  if (
    previousItem &&
    !(isSameRareReroll && candidates[0].rarity === ItemRarity.RARE)
  ) {
    const alternatives = candidates.filter(
      (item) => item.id !== previousItem.id,
    );
    if (alternatives.length > 0) {
      candidates = alternatives;
    }
  }

  const item = candidates[getRandomIndex(candidates.length, random)];
  if (item.rarity === ItemRarity.MAGIC) {
    appearance.magicAppearances += 1;
    appearance.magicAppearedThisRound = true;
  } else if (
    item.rarity === ItemRarity.RARE &&
    appearance.lastRareAppearanceRound !== appearance.round
  ) {
    appearance.lastRareAppearanceRound = appearance.round;
  }
  return item;
}

function createResult(
  slots: ShopSlot[],
  appearance: AppearanceState,
): ShopStockResult {
  return {
    slots,
    round: appearance.round,
    magicAppearances: appearance.magicAppearances,
    magicAppearedThisRound: appearance.magicAppearedThisRound,
    lastRareAppearanceRound: appearance.lastRareAppearanceRound,
    retiredRareItemIds: appearance.retiredRareItemIds,
  };
}

export function createInitialShopStock(
  random: () => number = Math.random,
): ShopStockResult {
  const appearance: AppearanceState = {
    round: 1,
    magicAppearances: 0,
    magicAppearedThisRound: false,
    lastRareAppearanceRound: null,
    retiredRareItemIds: [],
  };
  const slots = slotIds.map((id) => ({
    id,
    item: pickItem(id, random, items, appearance),
    soldItem: null,
  }));
  return createResult(slots, appearance);
}

export function createInitialShopSlots(
  random: () => number = Math.random,
): ShopSlot[] {
  return createInitialShopStock(random).slots;
}

export function rerollShopStock(
  shop: ShopState,
  random: () => number = Math.random,
): ShopStockResult {
  const appearance: AppearanceState = {
    round: shop.round ?? 1,
    magicAppearances: shop.magicAppearances ?? 0,
    magicAppearedThisRound:
      shop.magicAppearedThisRound ??
      shop.slots.some((slot) => slot.item?.rarity === ItemRarity.MAGIC),
    lastRareAppearanceRound: shop.lastRareAppearanceRound ?? null,
    retiredRareItemIds: shop.retiredRareItemIds ?? [],
  };
  const slots = shop.slots.map((slot) => ({
    ...slot,
    item: pickItem(
      slot.id,
      random,
      shop.itemCatalog,
      appearance,
      slot.item,
      true,
    ),
    soldItem: null,
  }));
  return createResult(slots, appearance);
}

export function rerollShopSlots(
  shop: ShopState,
  random: () => number = Math.random,
): ShopSlot[] {
  return rerollShopStock(shop, random).slots;
}

export function normalizeShopState(
  value: unknown,
  characterLevel = 1,
): ShopState {
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
    const currentMagicCount = slots.filter(
      (slot) => slot.item?.rarity === ItemRarity.MAGIC,
    ).length;
    const currentRare = slots.find(
      (slot) => slot.item?.rarity === ItemRarity.RARE,
    )?.item;

    return {
      slots,
      itemCatalog: items,
      rerollUsedThisRound: value.rerollUsedThisRound === true,
      purchaseMadeThisRound:
        value.purchaseMadeThisRound === true ||
        (value.purchaseMadeThisRound === undefined &&
          slots.some((slot) => slot.item === null)),
      round:
        typeof value.round === "number" && Number.isInteger(value.round)
          ? value.round
          : characterLevel,
      magicAppearances:
        typeof value.magicAppearances === "number" &&
        Number.isInteger(value.magicAppearances)
          ? value.magicAppearances
          : currentMagicCount,
      magicAppearedThisRound:
        typeof value.magicAppearedThisRound === "boolean"
          ? value.magicAppearedThisRound
          : currentMagicCount > 0,
      lastRareAppearanceRound:
        typeof value.lastRareAppearanceRound === "number" &&
        Number.isInteger(value.lastRareAppearanceRound)
          ? value.lastRareAppearanceRound
          : currentRare
            ? characterLevel
            : null,
      retiredRareItemIds: Array.isArray(value.retiredRareItemIds)
        ? value.retiredRareItemIds.filter(
            (id): id is number => typeof id === "number" && Number.isInteger(id),
          )
        : [],
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
      round: characterLevel,
      magicAppearances: 0,
      magicAppearedThisRound: false,
      lastRareAppearanceRound: null,
      retiredRareItemIds: [],
    };
  }

  throw new Error("Invalid saved shop state.");
}

export function restockShopStock(
  shop: ShopState,
  random: () => number = Math.random,
): ShopStockResult {
  const appearance: AppearanceState = {
    round: (shop.round ?? 1) + 1,
    magicAppearances: shop.magicAppearances ?? 0,
    magicAppearedThisRound: shop.slots.some(
      (slot) => slot.item?.rarity === ItemRarity.MAGIC,
    ),
    lastRareAppearanceRound: shop.lastRareAppearanceRound ?? null,
    retiredRareItemIds: shop.retiredRareItemIds ?? [],
  };
  const slots = shop.slots.map((slot) => ({
    ...slot,
    item:
      slot.item ??
      pickItem(slot.id, random, shop.itemCatalog, appearance),
    soldItem: slot.item === null ? null : slot.soldItem,
  }));
  return createResult(slots, appearance);
}

export function restockEmptyShopSlots(
  shop: ShopState,
  random: () => number = Math.random,
): ShopSlot[] {
  return restockShopStock(shop, random).slots;
}
