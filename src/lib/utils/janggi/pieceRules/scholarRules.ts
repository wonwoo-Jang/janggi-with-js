import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggiTypes';

import {
  DIRECTION_NUM,
  LINEAR_DX,
  LINEAR_DY,
  CORNER_NUM,
  PALACE_CORNERS,
  DIAG_DX,
  DIAG_DY,
} from '@utils/janggi/constants';

import { getPalaceCenterDiagonalMoves, isInPalace, isTileOccupiedByMyCountry } from '../common';

// same as king move
export const getPossibleScholarMoves = (scholar: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const { x: currX, y: currY } = scholar.position;

  // linear move
  for (let i = 0; i < DIRECTION_NUM; i++) {
    const position: Position = new Position(currX + LINEAR_DX[i], currY + LINEAR_DY[i]);
    if (isInPalace(position) && !isTileOccupiedByMyCountry(scholar.country, position, board)) {
      possibleMoves.push(position);
    }
  }

  // diagonal move at the corner
  for (let i = 0; i < CORNER_NUM; i++) {
    const isAtPalaceCorner = PALACE_CORNERS[i].some(corner => corner.isSamePosition(scholar.position));
    if (isAtPalaceCorner) {
      const diagonalMove: Position = new Position(currX + DIAG_DX[i], currY + DIAG_DY[i]);
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
