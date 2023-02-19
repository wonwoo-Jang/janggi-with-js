import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import {
  isNeckBlocked,
  isTileOccupied,
  isTileOccupiedByMyCountry,
  pieceOccupyingTile,
} from './generalRules';

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
  const isNeckBlocked = isTileOccupied(
    new Position(initPosition.x + neckX, initPosition.y + neckY),
    board,
  );
  return !isNeckBlocked;
};

export const getPossibleHorseMove = (horse: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [-1, 1];
  const { x: currX, y: currY } = horse.position;

  for (const dx of directions) {
    for (const dy of directions) {
      const verticalPosition: Position = new Position(currX + dx * 2, currY + dy * 1);
      const horizontalPosition: Position = new Position(currX + dx * 1, currY + dy * 2);

      [verticalPosition, horizontalPosition].forEach(position => {
        if (
          !isTileOccupiedByMyCountry(horse.country, position, board) &&
          !isNeckBlocked(dx, dy, 1, position, board)
        ) {
          possibleMoves.push(position);
        }
      });
    }
  }

  return possibleMoves;
};
