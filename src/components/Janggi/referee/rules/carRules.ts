import { COLUMN_LEN, ROW_LEN } from '@components/Janggi/JanggiBoard';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import {
  CORNER_NUM,
  getPalaceCenterDiagonalMoves,
  isInBoard,
  isTileOccupied,
  isTileOccupiedByOpponent,
  palaceCornerPositions,
  diagDx,
  diagDy,
} from './generalRules';

const getLinearMoves = (
  dx: number, // direction of x to move (down: -1, up: 1)
  dy: number, // direction of y to move (left: -1, right: 1)
  maxDistance: number,
  car: Piece,
  board: Board,
): Position[] => {
  const linearMoves: Position[] = [];
  const { x: currX, y: currY } = car.position;

  // i: distance from current position
  for (let i = 1; i <= maxDistance; i++) {
    const position: Position = new Position(currX + i * dx, currY + i * dy);
    if (!isInBoard(position)) break;

    if (!isTileOccupied(position, board)) {
      // destination is empty
      linearMoves.push(position);
    } else {
      if (isTileOccupiedByOpponent(car.country, position, board)) {
        // oppenent is at the destination
        linearMoves.push(position);
      }
      break;
    }
  }
  return linearMoves;
};

export const getPossibleCarMoves = (car: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];

  // linear moves
  const directions = [1, -1];
  for (const d of directions) {
    const verticalMoves = getLinearMoves(d, 0, ROW_LEN - 1, car, board);
    const horizontalMoves = getLinearMoves(0, d, COLUMN_LEN - 1, car, board);
    possibleMoves.push(...verticalMoves);
    possibleMoves.push(...horizontalMoves);
  }

  // diagonal moves at the corner of the palace
  for (let i = 0; i < CORNER_NUM; i++) {
    const isAtPalaceCorner = palaceCornerPositions[i].some(corner =>
      corner.isSamePosition(car.position),
    );
    if (isAtPalaceCorner) {
      const diagonalMoves = getLinearMoves(diagDx[i], diagDy[i], 2, car, board);
      possibleMoves.push(...diagonalMoves);
      break;
    }
  }

  // diagonal moves at the center of the palace
  const palaceCenterDiagonalMoves = getPalaceCenterDiagonalMoves(car, board);
  possibleMoves.push(...palaceCenterDiagonalMoves);

  return possibleMoves;
};
