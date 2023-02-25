import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import { isInBoard, isNeckBlocked, isTileOccupiedByMyCountry } from '../generalRules';

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
