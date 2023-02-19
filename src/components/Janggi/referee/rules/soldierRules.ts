import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType } from '@customTypes/janggi';

import { isInPalace, isMovable, isTileOccupiedByMyCountry } from './generalRules';

export const isValidSoldierMove = (
  newPosition: Position,
  initPosition: Position,
  country: CountryType,
  board: Board,
): boolean => {
  // TODO: (feat) change direction depending on my country
  const direction: number = country === CountryType.CHO ? 1 : -1;

  // 궁성 내 대각선 이동
  const isMovingDiagonallyFromPalaceLeftCorner: boolean =
    (initPosition.isSamePosition(new Position(8, 4)) ||
      initPosition.isSamePosition(new Position(3, 4))) &&
    newPosition.x - initPosition.x === direction &&
    newPosition.y - initPosition.y === 1;
  const isMovingDiagonallyFromPalaceRightCorner: boolean =
    (initPosition.isSamePosition(new Position(8, 6)) ||
      initPosition.isSamePosition(new Position(3, 6))) &&
    newPosition.x - initPosition.x === direction &&
    newPosition.y - initPosition.y === -1;
  const isMovingDiagonallyFromPalaceCenter: boolean =
    (initPosition.isSamePosition(new Position(2, 5)) ||
      initPosition.isSamePosition(new Position(9, 5))) &&
    newPosition.x - initPosition.x === direction &&
    Math.abs(newPosition.y - initPosition.y) === 1;

  if (
    isMovingDiagonallyFromPalaceLeftCorner ||
    isMovingDiagonallyFromPalaceRightCorner ||
    isMovingDiagonallyFromPalaceCenter
  ) {
    return true;
  }

  const isMovingOneSpaceUp: boolean =
    newPosition.x - initPosition.x === direction && newPosition.y === initPosition.y;
  const isMovingOneSpaceAside: boolean =
    Math.abs(newPosition.y - initPosition.y) === 1 && newPosition.x === initPosition.x;

  return isMovingOneSpaceUp || isMovingOneSpaceAside;
};

export const getPossibleSoldierMoves = (soldier: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];

  const POSITION_NUM = 3;
  const direction: number = soldier.country === CountryType.CHO ? 1 : -1;
  const dx: number[] = [direction, 0, 0];
  const dy: number[] = [0, -1, 1];
  const { x: currX, y: currY } = soldier.position;

  for (let i = 0; i < POSITION_NUM; i++) {
    const position = new Position(currX + dx[i], currY + dy[i]);
    if (isMovable(soldier.country, position, board)) {
      possibleMoves.push(position);
    }
  }

  return possibleMoves;
};
