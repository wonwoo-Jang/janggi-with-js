import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import { isMovable, pieceOccupyingTile } from './generalRules';

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

export const getPossibleHorseMove = (horse: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];

  const POSITION_NUM = 8;
  const dx = [2, 2, 1, -1, -2, -2, -1, 1]; // better to avoid hard coding...
  const dy = [-1, 1, 2, 2, 1, -1, -2, -2]; // ditto
  const { x: currX, y: currY } = horse.position;

  for (let i = 0; i < POSITION_NUM; i++) {
    const position = new Position(currX + dx[i], currY + dy[i]);
    if (isMovable(horse.country, position, board)) {
      const neckX = dx[i] < 0 ? 1 : -1;
      const neckY = dy[i] < 0 ? 1 : -1;
      const isNeckOpen = !pieceOccupyingTile(
        new Position(position.x - neckX, position.y - neckY),
        board,
      );
      if (isNeckOpen) possibleMoves.push(position);
    }
  }

  return possibleMoves;
};
