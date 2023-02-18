import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType } from '@customTypes/janggi';

import { isInPalace, isTileOccupiedByMyCountry } from './generalRules';

export const getPossibleSoldierMove = (
  position: Position,
  country: CountryType,
  board: Board,
): Position[] => {
  // 위 왼쪽 오른쪽
  // const { r, c } = position;
  // const direction = country === CountryType.CHO ? 1 : -1;
  // const possibleMoves: Position[] = [];
  // if (r + direction < 11) {
  //   const newPosition = new Position(r + direction, c);
  //   if (!isTileOccupied(newPosition, board)) {
  //     possibleMoves.push(newPosition);

  //   }
  // }
  // if (c + 1 < 10) possibleMoves.push(new Position(r, c + 1));
  // if (c - 1 > 0) possibleMoves.push(new Position(r, c - 1));
  // return possibleMoves;
  return [];
};

export const isValidSoldierMove = (
  newPosition: Position,
  initPosition: Position,
  country: CountryType,
  board: Board,
): boolean => {
  if (isTileOccupiedByMyCountry(country, newPosition, board)) return false;

  // TODO: (feat) change direction depending on my country
  const direction = country === CountryType.CHO ? 1 : -1;

  // 궁성 내 대각선 이동
  const isMovingDiagonallyFromPalaceLeftCorner =
    (initPosition.isSamePosition(new Position(8, 4)) ||
      initPosition.isSamePosition(new Position(3, 4))) &&
    newPosition.r - initPosition.r === direction &&
    newPosition.c - initPosition.c === 1;
  const isMovingDiagonallyFromPalaceRightCorner =
    (initPosition.isSamePosition(new Position(8, 6)) ||
      initPosition.isSamePosition(new Position(3, 6))) &&
    newPosition.r - initPosition.r === direction &&
    newPosition.c - initPosition.c === -1;
  const isMovingDiagonallyFromPalaceCenter =
    (initPosition.isSamePosition(new Position(2, 5)) ||
      initPosition.isSamePosition(new Position(9, 5))) &&
    newPosition.r - initPosition.r === direction &&
    Math.abs(newPosition.c - initPosition.c) === 1;

  if (
    isMovingDiagonallyFromPalaceLeftCorner ||
    isMovingDiagonallyFromPalaceRightCorner ||
    isMovingDiagonallyFromPalaceCenter
  ) {
    return true;
  }

  const isMovingOneSpaceUp =
    newPosition.r - initPosition.r === direction && newPosition.c === initPosition.c;
  const isMovingOneSpaceAside =
    Math.abs(newPosition.c - initPosition.c) === 1 && newPosition.r === initPosition.r;

  return isMovingOneSpaceUp || isMovingOneSpaceAside;
};
