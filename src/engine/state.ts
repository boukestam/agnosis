import { Level } from '../constants/levels';
import { Animation, RandomAnimation, TimedAnimation } from './animation';
import { Movement } from './movement';
import { Position } from './position';

const idleAnimation: [number, number][] = [
  [16, 32],
  [16, 48],
];
const idleAnimationDuration = 500;

const walkAnimation: [number, number][] = [
  [32, 32],
  [48, 32],
];
const walkAnimationDuration = 100;

export function indexToXY(i: number, width: number): [number, number] {
  return [i % width, Math.floor(i / width)];
}

export class GameState {
  level: Level;

  animation: Animation;
  playerMovement: Movement;
  blockMovements: Movement[];
  steps: number[];

  constructor(level: Level, steps?: number[]) {
    this.level = JSON.parse(JSON.stringify(level));

    this.animation = new RandomAnimation(idleAnimation, idleAnimationDuration);

    this.steps = steps || [0];

    this.playerMovement = new Movement(
      new Position(...indexToXY(level.player, level.width)),
      moving => {
        if (moving) {
          this.animation = new TimedAnimation(walkAnimation, walkAnimationDuration);
        } else {
          this.animation = new RandomAnimation(idleAnimation, idleAnimationDuration);
        }
      },
    );

    this.blockMovements = level.blocks.map(
      block => new Movement(new Position(...indexToXY(block, level.width))),
    );
  }

  clone() {
    return new GameState(this.level, this.steps);
  }
}
