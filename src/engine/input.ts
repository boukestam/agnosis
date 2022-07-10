import { GameState } from './state';

export function handleInput(e: KeyboardEvent, state: GameState): GameState {
  const level = state.level;

  function increaseIndex(i: number, x: number, y: number) {
    return i + x + y * level.width;
  }

  const before = state.clone();

  let deltaX = 0,
    deltaY = 0;
  let step = 0;

  if (e.key === 'ArrowUp') (deltaY = -1), (step = 1);
  else if (e.key === 'ArrowDown') (deltaY = 1), (step = 3);
  else if (e.key === 'ArrowLeft') (deltaX = -1), (step = 4);
  else if (e.key === 'ArrowRight') (deltaX = 1), (step = 2);
  else return before;

  level.player = increaseIndex(level.player, deltaX, deltaY);

  for (const wall of level.walls) {
    if (level.player === wall) return before;
  }

  for (let i = 0; i < level.blocks.length; i++) {
    if (level.blocks[i] === level.player) {
      level.blocks[i] = increaseIndex(level.blocks[i], deltaX, deltaY);

      for (const wall of level.walls) {
        if (level.blocks[i] === wall) return before;
      }

      for (let j = 0; j < level.blocks.length; j++) {
        if (i === j) continue;
        if (level.blocks[i] === level.blocks[j]) return before;
      }
    }
  }

  state.steps.push(step);

  return state;
}
