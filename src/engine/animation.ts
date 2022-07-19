export abstract class Animation {
  frames: [number, number][];
  frameDuration: number;

  currentFrame: number;
  currentFrameTime: number;

  constructor(frames: [number, number][], frameDuration: number) {
    this.frames = frames;
    this.frameDuration = frameDuration;

    this.currentFrame = 0;
    this.currentFrameTime = 0;
  }

  abstract getCurrentFrame(deltaTime: number): [number, number];
  abstract clone(): Animation;
}

export class RandomAnimation extends Animation {
  getCurrentFrame(deltaTime: number): [number, number] {
    this.currentFrameTime += deltaTime;

    if (this.currentFrameTime > this.frameDuration) {
      this.currentFrame = Math.floor(Math.random() * this.frames.length);
      this.currentFrameTime = this.currentFrameTime % this.frameDuration;
    }

    return this.frames[this.currentFrame];
  }

  clone(): Animation {
    return new RandomAnimation(this.frames, this.frameDuration);
  }
}

export class TimedAnimation extends Animation {
  getCurrentFrame(deltaTime: number): [number, number] {
    this.currentFrameTime += deltaTime;

    if (this.currentFrameTime > this.frameDuration) {
      this.currentFrame += Math.floor(this.currentFrameTime / this.frameDuration);
      this.currentFrameTime = this.currentFrameTime % this.frameDuration;
    }

    this.currentFrame = this.currentFrame % this.frames.length;
    return this.frames[this.currentFrame];
  }

  clone(): Animation {
    return new TimedAnimation(this.frames, this.frameDuration);
  }
}

const idleAnimation: [number, number][] = [
  [0, 32],
  [48, 32],
];
const idleAnimationDuration = 500;

const walkAnimation: [number, number][] = [
  [16, 32],
  [32, 32],
];
const walkAnimationDuration = 100;

export function IdleAnimation() {
  return new RandomAnimation(idleAnimation, idleAnimationDuration);
}

export function WalkAnimation() {
  return new TimedAnimation(walkAnimation, walkAnimationDuration);
}
