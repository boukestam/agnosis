import { Level } from '../constants/levels';
import { Animation, IdleAnimation } from './animation';
import { Movement } from './movement';
import { Position } from './position';

export function indexToXY(i: number, width: number): [number, number] {
  return [i % width, Math.floor(i / width)];
}

export class GameState {
  originalLevel: Level;
  level: Level;

  animation: Animation;
  playerMovement: Movement;
  blockMovements: Movement[];
  steps: number[];

  controlDown: boolean = false;

  constructor(
    level: Level,
    steps?: number[],
    animation?: Animation,
    playerMovement?: Movement,
    blockMovements?: Movement[],
  ) {
    this.originalLevel = level;
    this.level = JSON.parse(JSON.stringify(level));

    this.animation = animation || IdleAnimation();

    this.steps = steps || [0];

    this.playerMovement =
      playerMovement || new Movement(new Position(...indexToXY(level.player, level.width)));

    this.blockMovements =
      blockMovements ||
      level.blocks.map(block => new Movement(new Position(...indexToXY(block, level.width))));
  }

  clone() {
    const state = new GameState(
      this.level,
      this.steps.slice(),
      this.animation,
      this.playerMovement,
      this.blockMovements,
    );

    state.originalLevel = this.originalLevel;
    state.controlDown = this.controlDown;

    return state;
  }
}
