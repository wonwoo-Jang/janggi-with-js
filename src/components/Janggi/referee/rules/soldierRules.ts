import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { CountryType } from '@customTypes/janggi';

import { isInPalace, isTileOccupied } from './generalRules';

export const getPossibleSoldierMove = (
  position: Position,
  country: CountryType,
  board: { position: Position; piece: Piece }[][],
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
  board: { position: Position; piece: Piece | null }[][],
): boolean => {
  const occupyingPiece = isTileOccupied(newPosition, board);
  if (occupyingPiece && occupyingPiece.country === country) return false;
  const direction = country === CountryType.CHO ? 1 : -1;
  if (
    // 귀
    (initPosition.isSamePosition(new Position(8, 4)) ||
      initPosition.isSamePosition(new Position(3, 4))) &&
    newPosition.r - initPosition.r === direction &&
    newPosition.c - initPosition.c === 1
  ) {
    return true;
  } else if (
    // 귀
    (initPosition.isSamePosition(new Position(8, 6)) ||
      initPosition.isSamePosition(new Position(3, 6))) &&
    newPosition.r - initPosition.r === direction &&
    newPosition.c - initPosition.c === -1
  ) {
    return true;
  } else if (
    // 궁중
    (initPosition.isSamePosition(new Position(2, 5)) ||
      initPosition.isSamePosition(new Position(9, 5))) &&
    newPosition.r - initPosition.r === direction &&
    Math.abs(newPosition.c - initPosition.c) === 1
  ) {
    return true;
  }

  if (
    (newPosition.r - initPosition.r === direction && newPosition.c === initPosition.c) ||
    (Math.abs(newPosition.c - initPosition.c) === 1 && newPosition.r === initPosition.r)
  ) {
    if (occupyingPiece) {
      // attack
    }
    return true;
  } else {
    return false;
  }
  // const possibleMoves = getPossibleSoldierMove(position, country, board);
  // const isValid = possibleMoves.some(p => newPosition.isSamePosition(p));
  // return isValid;
};
