import { Item } from './shop';

export type CharacterStat = {
  name: CharacterStatName;
  value: number;
};

export type CharacterStatName = 'attack' | 'defense' | 'life';

export type CharacterState = {
  name: string;
  image: string;
  level: number;
  points: number;
  stats: CharacterStat[];
  gold: number;
  items: Item[];
  isEditing: boolean;
};

export type CharacterProps = {
  level: number;
  points: number;
  stats: CharacterStat[];
  gold: number;
};
