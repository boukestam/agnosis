import React, { useEffect, useRef } from 'react';

import { Level } from '../constants/levels';
import { handleInput } from '../engine/input';
import { render } from '../engine/render';
import { GameState } from '../engine/state';
import { hslToRgb, swapColors } from '../utils/color';

export function Game({
  level,
  tileSize,
  onChange,
}: {
  level: Level;
  tileSize: number;
  onChange: (state: GameState) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;

    canvas.current.width = level.width * tileSize;
    canvas.current.height = level.height * tileSize;

    const ctx = canvas.current.getContext('2d') as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;

    let timeout: number;

    let state = new GameState(level);

    let previousTime = -1;

    const loop = (time: number) => {
      if (previousTime === -1) previousTime = time;
      const delta = time - previousTime;
      previousTime = time;

      render(state, sprites, ctx, tileSize, delta);
      timeout = requestAnimationFrame(loop);
    };

    const spritesImage = new Image(160, 160);
    const sprites = new Image(160, 160);
    spritesImage.onload = () => {
      sprites.src = swapColors(spritesImage);

      timeout = requestAnimationFrame(loop);
    };
    spritesImage.src = process.env.PUBLIC_URL + '/spritesheet.png';

    const handler = (e: KeyboardEvent) => {
      state = handleInput(e, state);
      onChange(state.clone());
    };
    document.addEventListener('keydown', handler);

    return () => {
      spritesImage.onload = null;
      cancelAnimationFrame(timeout);
      document.removeEventListener('keydown', handler);
    };
  }, [canvas, level, tileSize]);

  return <canvas ref={canvas}></canvas>;
}
