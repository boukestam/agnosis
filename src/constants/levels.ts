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
  simple[3],
  simple[7],
  simple[8],
  simple[0],
  sokhard[0],
  sokhard[4],
  sokhard[8],
  sokhard[9],
  sokhard[10],
  sokompact[0],
  sokompact[1],
  sokompact[2],
  sokompact[3],
  sokompact[4],
];
