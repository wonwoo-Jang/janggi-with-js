import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import { isInPalace, isTileOccupiedByMyCountry, PALACE } from './generalRules';

export const getPossibleKingMoves = (king: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const { x: currX, y: currY } = king.position;

  const dx = [1, -1, 0, 0];
  const dy = [0, 0, -1, 1];

  const DIRECTION_NUM = 4;
  for (let i = 0; i < DIRECTION_NUM; i++) {
    const position: Position = new Position(currX + dx[i], currY + dy[i]);
    if (isInPalace(position) && !isTileOccupiedByMyCountry(king.country, position, board)) {
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
      corner.isSamePosition(king.position),
    );
    if (isAtPalaceCorner) {
      const diagonalMove: Position = new Position(currX + palaceDx[i], currY + palaceDy[i]);
      if (!isTileOccupiedByMyCountry(king.country, diagonalMove, board)) {
        possibleMoves.push(diagonalMove);
      }
      break;
    }
  }

  // diagonal moves at the center of the palace
  if (
    king.position.isSamePosition(PALACE.cho.center) ||
    king.position.isSamePosition(PALACE.han.center)
  ) {
    for (let i = 0; i < DIRECTION_NUM; i++) {
      const position: Position = new Position(
        king.position.x + palaceDx[i],
        king.position.y + palaceDy[i],
      );
      if (!isTileOccupiedByMyCountry(king.country, position, board)) {
        possibleMoves.push(position);
      }
    }
  }

  return possibleMoves;
};
