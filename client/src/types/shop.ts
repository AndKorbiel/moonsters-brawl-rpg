import { CharacterStat } from './character';

export type Item = {
  id: number;
  name: string;
  image: string;
  price: number;
  stats: CharacterStat[];
};

export type ShopState = {
  availableItems: Item[];
};
