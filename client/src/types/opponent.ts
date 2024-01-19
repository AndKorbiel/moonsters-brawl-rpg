import { CharacterStat } from './character';

export type OpponentState = {
  name: string;
  level: number;
  image: string;
  points: number;
  stats: CharacterStat[];
  isReady: boolean;
};

export type OpponentProps = {
  level: number;
  points: number;
  stats: CharacterStat[];
  isReady: boolean;
};
