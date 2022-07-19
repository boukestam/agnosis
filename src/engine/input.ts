import { GameSounds } from '../components/sokoban';
import { Level } from '../constants/levels';
import { GameState } from './state';

function advance(level: Level, step: number): { success: boolean; blockPushed: boolean } {
  function increaseIndex(i: number, x: number, y: number) {
    return i + x + y * level.width;
  }

  const deltaX = step === 4 ? -1 : step === 2 ? 1 : 0;
  const deltaY = step === 1 ? -1 : step === 3 ? 1 : 0;

  level.player = increaseIndex(level.player, deltaX, deltaY);

  for (const wall of level.walls) {
    if (level.player === wall) return { success: false, blockPushed: false };
  }

  for (let i = 0; i < level.blocks.length; i++) {
    if (level.blocks[i] === level.player) {
      level.blocks[i] = increaseIndex(level.blocks[i], deltaX, deltaY);

      for (const wall of level.walls) {
        if (level.blocks[i] === wall) return { success: false, blockPushed: false };
      }

      for (let j = 0; j < level.blocks.length; j++) {
        if (i === j) continue;
        if (level.blocks[i] === level.blocks[j]) return { success: false, blockPushed: false };
      }

      return { success: true, blockPushed: true };
    }
  }

  return { success: true, blockPushed: false };
}

export function undo(state: GameState) {
  state.level = JSON.parse(JSON.stringify(state.originalLevel));

  for (let i = 0; i < state.steps.length - 1; i++) {
    advance(state.level, state.steps[i]);
  }

  state.steps = state.steps.slice(0, -1);

  return state;
}

export function handleInput(e: KeyboardEvent, state: GameState, sounds: GameSounds): GameState {
  const before = state.clone();

  let step = 0;

  if (e.key === 'ArrowUp') step = 1;
  else if (e.key === 'ArrowDown') step = 3;
  else if (e.key === 'ArrowLeft') step = 4;
  else if (e.key === 'ArrowRight') step = 2;
  else if (e.key === 'Control' || e.key === 'Meta') {
    state.controlDown = true;
    return state;
  } else if (e.key === 'z' && state.controlDown) {
    return undo(state);
  } else return state;

  const result = advance(state.level, step);
  if (!result.success) return before;

  sounds.walk.currentTime = 0;
  sounds.walk.play();

  if (result.blockPushed) {
    sounds.push.currentTime = 0;
    sounds.push.play();
  }

  state.steps.push(step);

  return state;
}
