import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import { pieceOccupyingTile } from './generalRules';

export const isValidHorseMove = (
  newPosition: Position,
  initPosition: Position,
  board: Board,
): boolean => {
  const diffX = newPosition.x - initPosition.x;
  const diffY = newPosition.y - initPosition.y;
  const isValidPosition =
    (Math.abs(diffX) === 2 && Math.abs(diffY) === 1) ||
    (Math.abs(diffX) === 1 && Math.abs(diffY) === 2);

  if (!isValidPosition) return false;

  const neckX = diffX < 0 ? Math.ceil(diffX / 2) : Math.floor(diffX / 2);
  const neckY = diffY < 0 ? Math.ceil(diffY / 2) : Math.floor(diffY / 2);
  const isNeckOpen = !pieceOccupyingTile(
    new Position(initPosition.x + neckX, initPosition.y + neckY),
    board,
  );
  return isNeckOpen;
};
