import { ROW_LEN } from '@components/Janggi/JanggiBoard';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType } from '@customTypes/janggi';

import {
  isTileOccupied,
  isTileOccupiedByMyCountry,
  isTileOccupiedByOpponent,
  PALACE,
} from './generalRules';

const getLinearMoves = (
  dx: number,
  dy: number,
  maxDistance: number,
  car: Piece,
  board: Board,
): Position[] => {
  const linearMoves: Position[] = [];
  const { x: currX, y: currY } = car.position;

  for (let i = 1; i < maxDistance; i++) {
    const position: Position = new Position(currX + i * dx, currY + i * dy);
    if (!isTileOccupied(position, board)) {
      // destination is empty
      linearMoves.push(position);
    } else {
      if (isTileOccupiedByOpponent(car.country, position, board)) {
        // oppenent at destination
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
    const normalMoves = getLinearMoves(dx[i], dy[i], ROW_LEN, car, board);
    possibleMoves.push(...normalMoves);
  }

  // can move diagonally inside the palace
  let palaceDx = 0;
  let palaceDy = 0;
  if (
    car.position.isSamePosition(PALACE.cho.bottomLeft) ||
    car.position.isSamePosition(PALACE.han.topRight)
  ) {
    palaceDx = 1;
    palaceDy = 1;
  } else if (
    car.position.isSamePosition(PALACE.cho.bottomRight) ||
    car.position.isSamePosition(PALACE.han.topLeft)
  ) {
    palaceDx = 1;
    palaceDy = -1;
  } else if (
    car.position.isSamePosition(PALACE.cho.topLeft) ||
    car.position.isSamePosition(PALACE.han.bottomRight)
  ) {
    palaceDx = -1;
    palaceDy = 1;
  } else if (
    car.position.isSamePosition(PALACE.cho.topRight) ||
    car.position.isSamePosition(PALACE.han.bottomLeft)
  ) {
    palaceDx = -1;
    palaceDy = -1;
  } else if (
    car.position.isSamePosition(PALACE.cho.center) ||
    car.position.isSamePosition(PALACE.han.center)
  ) {
    console.log('Center');
  }

  const palaceMoves = getLinearMoves(palaceDx, palaceDy, 3, car, board);
  possibleMoves.push(...palaceMoves);

  return possibleMoves;
};
