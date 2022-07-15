import React, { useEffect, useRef } from 'react';

import { Level } from '../constants/levels';
import { handleInput } from '../engine/input';
import { render } from '../engine/render';
import { GameState } from '../engine/state';

export interface GameSounds {
  walk: HTMLAudioElement;
  push: HTMLAudioElement;
}

export function Sokoban({
  level,
  tileSize,
  onChange,
  sprites,
}: {
  level: Level;
  tileSize: number;
  onChange: (state: GameState) => void;
  sprites: HTMLImageElement;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;

    canvas.current.width = level.width * tileSize;
    canvas.current.height = level.height * tileSize;

    const ctx = canvas.current.getContext('2d') as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;

    let state = new GameState(level);

    let previousTime = -1;

    const loop = (time: number) => {
      if (previousTime === -1) previousTime = time;
      const delta = time - previousTime;
      previousTime = time;

      render(state, sprites, ctx, tileSize, delta);
      timeout = requestAnimationFrame(loop);
    };

    let timeout = requestAnimationFrame(loop);

    const sounds = {
      walk: new Audio(process.env.PUBLIC_URL + '/sound/walk.wav'),
      push: new Audio(process.env.PUBLIC_URL + '/sound/push.wav'),
    };

    const handler = (e: KeyboardEvent) => {
      state = handleInput(e, state, sounds);
      onChange(state.clone());
    };
    document.addEventListener('keydown', handler);

    return () => {
      cancelAnimationFrame(timeout);
      document.removeEventListener('keydown', handler);
    };
  }, [canvas, level, tileSize]);

  return <canvas ref={canvas}></canvas>;
}
