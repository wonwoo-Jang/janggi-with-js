import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import { isNeckBlocked, isTileOccupiedByMyCountry } from './generalRules';

export const getPossibleElephantMoves = (elephant: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [-1, 1];
  const { x: currX, y: currY } = elephant.position;

  for (const dx of directions) {
    for (const dy of directions) {
      const verticalPosition: Position = new Position(currX + dx * 3, currY + dy * 2);
      const horizontalPosition: Position = new Position(currX + dx * 2, currY + dy * 3);

      [verticalPosition, horizontalPosition].forEach(position => {
        if (
          !isTileOccupiedByMyCountry(elephant.country, position, board) &&
          !isNeckBlocked(dx, dy, 2, position, board)
        ) {
          possibleMoves.push(position);
        }
      });
    }
  }

  return possibleMoves;
};
