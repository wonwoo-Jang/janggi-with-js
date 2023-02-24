import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import {
  CORNER_NUM,
  getPalaceCenterDiagonalMoves,
  isInPalace,
  isTileOccupiedByMyCountry,
  palaceCornerPositions,
  diagDx,
  diagDy,
  DIRECTION_NUM,
  linearDx,
  linearDy,
} from './generalRules';

// same as king move
export const getPossibleScholarMoves = (scholar: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const { x: currX, y: currY } = scholar.position;

  // linear move
  for (let i = 0; i < DIRECTION_NUM; i++) {
    const position: Position = new Position(currX + linearDx[i], currY + linearDy[i]);
    if (isInPalace(position) && !isTileOccupiedByMyCountry(scholar.country, position, board)) {
      possibleMoves.push(position);
    }
  }

  // diagonal move at the corner
  for (let i = 0; i < CORNER_NUM; i++) {
    const isAtPalaceCorner = palaceCornerPositions[i].some(corner => corner.isSamePosition(scholar.position));
    if (isAtPalaceCorner) {
      const diagonalMove: Position = new Position(currX + diagDx[i], currY + diagDy[i]);
      if (!isTileOccupiedByMyCountry(scholar.country, diagonalMove, board)) {
        possibleMoves.push(diagonalMove);
      }
      break;
    }
  }

  // diagonal moves at the center of the palace
  const palaceCenterDiagonalMoves = getPalaceCenterDiagonalMoves(scholar, board);
  possibleMoves.push(...palaceCenterDiagonalMoves);

  return possibleMoves;
};
