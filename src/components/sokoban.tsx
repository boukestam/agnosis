import React, { useEffect, useRef } from 'react';

import { handleInput, undo } from '../engine/input';
import { render } from '../engine/render';
import { GameState } from '../engine/state';
import Button from './button';
import { Modal } from './modal';

export interface GameSounds {
  walk: HTMLAudioElement;
  push: HTMLAudioElement;
}

export function Sokoban({
  levelNumber,
  tileSize,
  state,
  onChange,
  onBack,
  onReset,
  sprites,
}: {
  levelNumber: number;
  tileSize: number;
  onBack: () => void;
  onReset: () => void;
  state: GameState;
  onChange: (state: GameState) => void;
  sprites: HTMLImageElement;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;

    canvas.current.width = state.level.width * tileSize;
    canvas.current.height = state.level.height * tileSize;

    const ctx = canvas.current.getContext('2d') as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;

    let previousTime = -1;

    const loop = (time: number) => {
      if (previousTime === -1) previousTime = time;
      const delta = time - previousTime;
      previousTime = time;

      render(state, sprites, ctx, tileSize, delta);
      timeout = requestAnimationFrame(loop);
    };

    let timeout = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(timeout);
    };
  }, [canvas, tileSize, state, sprites]);

  useEffect(() => {
    const sounds = {
      walk: new Audio(process.env.PUBLIC_URL + '/sound/walk.wav'),
      push: new Audio(process.env.PUBLIC_URL + '/sound/push.wav'),
    };

    const handler = (e: KeyboardEvent) => {
      onChange(handleInput(e, state, sounds));
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [onChange, state]);

  function onUndo() {
    undo(state);
    onChange(state);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full mb-8">
        <Button onClick={onBack}>
          <img src={process.env.PUBLIC_URL + '/back.png'} alt="back" className="w-5" />
        </Button>
        <Button onClick={onReset} className="ml-2">
          Reset
        </Button>
        <Button onClick={onUndo} className="ml-2">
          Undo
        </Button>

        <div className="flex-1"></div>

        <div className="mx-2 paper">
          <div className="px-2 py-1 bg-ui-paper">Level {levelNumber + 1}</div>
        </div>

        <div className="w-[164px] paper">
          <div className="px-2 py-1 bg-ui-paper">Steps: {state?.steps.length || 1}/128</div>
        </div>
      </div>

      <canvas ref={canvas}></canvas>

      {state.steps.length >= 128 && (
        <Modal>
          <div className="text-white border-text-light">
            You've reached the maximum number of moves
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={onReset} className="ml-2">
              Reset
            </Button>
            <Button onClick={onUndo} className="ml-2">
              Undo
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
