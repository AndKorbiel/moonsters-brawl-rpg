import { CharacterStat } from "./character";

export enum ItemType {
  ARMOR = "armor",
  MAGIC = "magic",
  OFF_HAND = "off-hand",
  WEAPON = "weapon",
}

export type Item = {
  id: number;
  name: string;
  image: string;
  price: number;
  type: ItemType;
  stats: CharacterStat[];
};

export type ShopState = {
  availableItems: Item[];
};
