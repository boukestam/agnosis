import { Position } from './position';

export enum MovementAction {
  NONE,
  STARTED,
  STOPPED,
}

export class Movement {
  position: Position;
  targetPosition: Position;
  moving: boolean;

  constructor(position: Position) {
    this.position = position;
    this.targetPosition = position;
    this.moving = false;
  }

  setTargetPosition(position: Position) {
    this.targetPosition = position;
  }

  update(deltaTime: number): MovementAction {
    const delta = this.targetPosition.substract(this.position);
    if (delta.length() < 0.001) {
      if (this.moving) {
        this.moving = false;
        return MovementAction.STOPPED;
      }
      return MovementAction.NONE;
    }

    const angle = delta.angle();
    const change = Position.toAngle(angle, Math.min(delta.length(), deltaTime * 0.005));
    this.position = this.position.add(change);

    if (!this.moving) {
      this.moving = true;
      return MovementAction.STARTED;
    }

    return MovementAction.NONE;
  }

  clone() {
    const cloned = new Movement(this.position.clone());
    cloned.targetPosition = this.targetPosition.clone();
    cloned.moving = this.moving;
    return cloned;
  }
}
