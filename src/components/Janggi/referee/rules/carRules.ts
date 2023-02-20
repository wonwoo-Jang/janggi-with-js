import { ROW_LEN } from '@components/Janggi/JanggiBoard';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggi';

import {
  isInBoard,
  isTileOccupied,
  isTileOccupiedByMyCountry,
  isTileOccupiedByOpponent,
  PALACE,
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

  const directions = [1, -1];
  // top bottom left right
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, -1, 1];
  const DIRECTION_NUM = 4;
  for (let i = 0; i < DIRECTION_NUM; i++) {
    // 이거 가로 볼 때는 column_len으로 전달하는 게 맞긴 함
    const normalMoves = getLinearMoves(dx[i], dy[i], ROW_LEN - 1, car, board);
    possibleMoves.push(...normalMoves);
  }

  // can move diagonally inside the palace
  // 여기도 여전히 하드코딩한 느낌이 조금 있긴 한데 나중에 생각하자
  const palaceDx = [1, 1, -1, -1];
  const palaceDy = [1, -1, 1, -1];
  const CORNER_NUM = 4;
  const palaceCornerPositions: Position[][] = [
    [PALACE.cho.bottomLeft, PALACE.han.topRight],
    [PALACE.cho.bottomRight, PALACE.han.topLeft],
    [PALACE.cho.topLeft, PALACE.han.bottomRight],
    [PALACE.cho.topRight, PALACE.han.bottomLeft],
  ];
  let palaceIndex = -1;

  for (let i = 0; i < CORNER_NUM; i++) {
    const isAtPalaceCorner = palaceCornerPositions[i].some(corner =>
      corner.isSamePosition(car.position),
    );
    if (isAtPalaceCorner) {
      palaceIndex = i;
      break;
    }
  }

  if (palaceIndex !== -1) {
    const diagonalMoves = getLinearMoves(
      palaceDx[palaceIndex],
      palaceDy[palaceIndex],
      2,
      car,
      board,
    );
    possibleMoves.push(...diagonalMoves);
  }

  // can move to all diagonal directions if the piece is at the center of the palace
  if (
    car.position.isSamePosition(PALACE.cho.center) ||
    car.position.isSamePosition(PALACE.han.center)
  ) {
    for (let i = 0; i < DIRECTION_NUM; i++) {
      const position: Position = new Position(
        car.position.x + palaceDx[i],
        car.position.y + palaceDy[i],
      );
      if (!isTileOccupiedByMyCountry(car.country, position, board)) {
        possibleMoves.push(position);
      }
    }
  }

  return possibleMoves;
};
