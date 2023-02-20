import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import {
  isInBoard,
  isNeckBlocked,
  isTileOccupied,
  isTileOccupiedByMyCountry,
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

// 상이랑 행마 로직이 같음
export const getPossibleHorseMove = (horse: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [-1, 1];
  const { x: currX, y: currY } = horse.position;

  for (const dx of directions) {
    for (const dy of directions) {
      const verticalPosition: Position = new Position(currX + dx * 2, currY + dy * 1);
      const horizontalPosition: Position = new Position(currX + dx * 1, currY + dy * 2);

      for (const position of [verticalPosition, horizontalPosition]) {
        if (
          isInBoard(position) &&
          !isTileOccupiedByMyCountry(horse.country, position, board) &&
          !isNeckBlocked(dx, dy, 1, position, board)
        ) {
          possibleMoves.push(position);
        }
      }
    }
  }

  return possibleMoves;
};
