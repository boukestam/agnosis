import { Position } from './position';

export class Movement {
  position: Position;
  targetPosition: Position;
  moving: boolean;
  callback?: (moving: boolean) => void;

  constructor(position: Position, callback?: (moving: boolean) => void) {
    this.position = position;
    this.targetPosition = position;
    this.moving = false;
    this.callback = callback;
  }

  setTargetPosition(position: Position) {
    this.targetPosition = position;
  }

  update(deltaTime: number) {
    const delta = this.targetPosition.substract(this.position);
    if (delta.length() < 0.001) {
      if (this.moving) {
        this.callback?.(false);
        this.moving = false;
      }
      return;
    }

    const angle = delta.angle();
    const change = Position.toAngle(angle, Math.min(delta.length(), deltaTime * 0.005));
    this.position = this.position.add(change);

    if (!this.moving) {
      this.callback?.(true);
      this.moving = true;
    }
  }

  clone() {
    const cloned = new Movement(this.position.clone());
    cloned.targetPosition = this.targetPosition.clone();
    cloned.moving = this.moving;
    cloned.callback = this.callback;
    return cloned;
  }
}
