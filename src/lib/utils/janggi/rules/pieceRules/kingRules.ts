import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggiTypes';

import {
  DIRECTION_NUM,
  linearDx,
  linearDy,
  CORNER_NUM,
  palaceCornerPositions,
  diagDx,
  diagDy,
} from '@utils/janggi/constants';

import { getPalaceCenterDiagonalMoves, isInPalace, isTileOccupiedByMyCountry } from '../generalRules';

// same as scholar move
export const getPossibleKingMoves = (king: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const { x: currX, y: currY } = king.position;

  // linear move
  for (let i = 0; i < DIRECTION_NUM; i++) {
    const position: Position = new Position(currX + linearDx[i], currY + linearDy[i]);
    if (isInPalace(position) && !isTileOccupiedByMyCountry(king.country, position, board)) {
      possibleMoves.push(position);
    }
  }

  // diagonal move at the corner of the palace
  for (let i = 0; i < CORNER_NUM; i++) {
    const isAtPalaceCorner = palaceCornerPositions[i].some(corner => corner.isSamePosition(king.position));
    if (isAtPalaceCorner) {
      const diagonalMove: Position = new Position(currX + diagDx[i], currY + diagDy[i]);
      if (!isTileOccupiedByMyCountry(king.country, diagonalMove, board)) {
        possibleMoves.push(diagonalMove);
      }
      break;
    }
  }

  // diagonal moves at the center of the palace
  const palaceCenterDiagonalMoves = getPalaceCenterDiagonalMoves(king, board);
  possibleMoves.push(...palaceCenterDiagonalMoves);

  return possibleMoves;
};
