import { CharacterStat } from "./character";

export enum ItemType {
  ARMOR = "armor",
  MAGIC = "magic",
  OFF_HAND = "off-hand",
  WEAPON = "weapon",
}

export enum ItemRarity {
  COMMON = "common",
  MAGIC = "magic",
  RARE = "rare",
}

export type Item = {
  id: number;
  name: string;
  image: string;
  price: number;
  rarity: ItemRarity;
  type: ItemType;
  stats: CharacterStat[];
};

export enum ShopSlotId {
  ARMOR = "armor",
  MAGIC = "magic",
  WEAPON_OR_OFF_HAND = "weapon-or-off-hand",
}

export type ShopSlot = {
  id: ShopSlotId;
  item: Item | null;
  soldItem?: Item | null;
};

export type ShopState = {
  itemCatalog: Item[];
  slots: ShopSlot[];
  rerollUsedThisRound: boolean;
  purchaseMadeThisRound: boolean;
};

export type PersistedShopState =
  | (Pick<ShopState, "slots"> &
      Partial<
        Pick<ShopState, "rerollUsedThisRound" | "purchaseMadeThisRound">
      >)
  | { availableItems: Item[] };
