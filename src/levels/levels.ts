export interface Level {
  player: number;
  walls: number[];
  blocks: number[];
  targets: number[];
  width: number;
  height: number;
}

import simple from './simple.json';
import sokhard from './sokhard.json';
import sokompact from './sokompact.json';

export const levels = [
  simple[1],
  sokompact[4],
  sokompact[1],
  sokompact[3],
  simple[0],
  simple[3],
  simple[7],
  simple[8],
  sokompact[0],
  sokompact[2],
  sokhard[0],
  sokhard[14],
  sokhard[17],
  sokhard[18],
  sokhard[19],
];
