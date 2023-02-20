import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import { isInPalace, isTileOccupiedByMyCountry, PALACE } from './generalRules';

// same as king move
export const getPossibleScholarMoves = (scholar: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const { x: currX, y: currY } = scholar.position;

  const dx = [1, -1, 0, 0];
  const dy = [0, 0, -1, 1];

  const DIRECTION_NUM = 4;
  for (let i = 0; i < DIRECTION_NUM; i++) {
    const position: Position = new Position(currX + dx[i], currY + dy[i]);
    if (isInPalace(position) && !isTileOccupiedByMyCountry(scholar.country, position, board)) {
      possibleMoves.push(position);
    }
  }

  // diagonal moves
  const palaceDx = [1, 1, -1, -1];
  const palaceDy = [1, -1, 1, -1];
  const CORNER_NUM = 4;
  const palaceCornerPositions: Position[][] = [
    [PALACE.cho.bottomLeft, PALACE.han.topRight],
    [PALACE.cho.bottomRight, PALACE.han.topLeft],
    [PALACE.cho.topLeft, PALACE.han.bottomRight],
    [PALACE.cho.topRight, PALACE.han.bottomLeft],
  ];

  // diagonal move at the corner
  for (let i = 0; i < CORNER_NUM; i++) {
    const isAtPalaceCorner = palaceCornerPositions[i].some(corner =>
      corner.isSamePosition(scholar.position),
    );
    if (isAtPalaceCorner) {
      const diagonalMove: Position = new Position(currX + palaceDx[i], currY + palaceDy[i]);
      if (!isTileOccupiedByMyCountry(scholar.country, diagonalMove, board)) {
        possibleMoves.push(diagonalMove);
      }
      break;
    }
  }

  // diagonal moves at the center of the palace
  if (
    scholar.position.isSamePosition(PALACE.cho.center) ||
    scholar.position.isSamePosition(PALACE.han.center)
  ) {
    for (let i = 0; i < DIRECTION_NUM; i++) {
      const position: Position = new Position(
        scholar.position.x + palaceDx[i],
        scholar.position.y + palaceDy[i],
      );
      if (!isTileOccupiedByMyCountry(scholar.country, position, board)) {
        possibleMoves.push(position);
      }
    }
  }

  return possibleMoves;
};
