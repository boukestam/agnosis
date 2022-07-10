import { Level } from '../constants/levels';
import { Position } from './position';
import { GameState, indexToXY } from './state';

function getWallSprite(x: number, y: number, level: Level): [number, number] | null {
  const index = x + y * level.width;

  if (level.walls.some(w => w === index)) {
    const left = x > 0 && level.walls.some(w => w === index - 1);
    const right = x < level.width - 1 && level.walls.some(w => w === index + 1);
    const bottom = y < level.height - 1 && level.walls.some(w => w === index + level.width);
    const top = y > 0 && level.walls.some(w => w === index - level.width);

    if (top) {
      if (left && right && bottom) return [1, 1];
      if (left && right && !bottom) return [1, 2];

      if (!left && right && bottom) return [0, 1];
      if (left && !right && bottom) return [2, 1];

      if (!left && right && !bottom) return [0, 2];
      if (left && !right && !bottom) return [2, 2];

      if (!left && !right && bottom) return [3, 2];
      if (!left && !right && !bottom) return [3, 3];
    } else {
      if (left && right && bottom) return [1, 0];
      if (left && right && !bottom) return [1, 3];

      if (!left && right && bottom) return [0, 0];
      if (left && !right && bottom) return [2, 0];

      if (!left && right && !bottom) return [0, 3];
      if (left && !right && !bottom) return [2, 3];

      if (!left && !right && bottom) return [3, 1];
      if (!left && !right && !bottom) return [3, 0];
    }
  }

  return null;
}

export function render(
  state: GameState,
  sprites: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  tileSize: number,
  deltaTime: number,
) {
  const level = state.level;

  // Movement animation
  state.playerMovement.setTargetPosition(new Position(...indexToXY(level.player, level.width)));
  state.playerMovement.update(deltaTime);

  for (let i = 0; i < level.blocks.length; i++) {
    state.blockMovements[i].setTargetPosition(
      new Position(...indexToXY(level.blocks[i], level.width)),
    );
    state.blockMovements[i].update(deltaTime);
  }

  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, level.width * tileSize, level.height * tileSize);

  function getTileRect(i: number): [number, number, number, number] {
    const [x, y] = indexToXY(i, level.width);
    return [x * tileSize, y * tileSize, tileSize, tileSize];
  }

  for (let x = 1; x < level.width - 1; x++) {
    for (let y = 1; y < level.height - 1; y++) {
      const i = y * level.width + x;
      const hashX = ((i * 37) % 11) % 2;
      const hashY = ((i * 137) % 11) % 2;
      const tileOffsetX = hashX ? 5 * 16 : 6 * 16;
      const tileOffsetY = hashY ? 6 * 16 : 7 * 16;
      ctx.drawImage(sprites, tileOffsetX, tileOffsetY, 16, 16, ...getTileRect(i));
    }
  }

  for (let x = 0; x < level.width; x++) {
    for (let y = 0; y < level.height; y++) {
      const i = y * level.width + x;

      const sprite = getWallSprite(x, y, level);
      if (sprite) {
        ctx.drawImage(sprites, sprite[0] * 16, sprite[1] * 16 + 6 * 16, 16, 16, ...getTileRect(i));
      }
    }
  }

  for (const target of level.targets) {
    ctx.drawImage(sprites, 0, 32, 16, 16, ...getTileRect(target));
  }

  for (let i = 0; i < level.blocks.length; i++) {
    const movement = state.blockMovements[i];
    const isValid = level.targets.some(target => target === level.blocks[i]);

    ctx.drawImage(
      sprites,
      isValid ? 16 : 0,
      16,
      16,
      16,
      Math.round(movement.position.x * tileSize),
      Math.round(movement.position.y * tileSize),
      tileSize,
      tileSize,
    );
  }

  const lastStep = state.steps[state.steps.length - 1];
  const flip = lastStep === 4 ? -1 : 1;

  ctx.save();
  ctx.translate(
    Math.round(state.playerMovement.position.x * tileSize),
    Math.round(state.playerMovement.position.y * tileSize),
  );
  ctx.scale(flip, 1);

  ctx.drawImage(
    sprites,
    ...state.animation.getCurrentFrame(deltaTime),
    16,
    16,
    0,
    0,
    flip * tileSize,
    tileSize,
  );

  ctx.restore();
}
