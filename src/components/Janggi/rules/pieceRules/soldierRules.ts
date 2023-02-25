import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType } from '@customTypes/janggi';

import { isInBoard, isInPalace, isTileOccupiedByMyCountry, PALACE } from '../generalRules';

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
    (initPosition.isSamePosition(new Position(8, 4)) || initPosition.isSamePosition(new Position(3, 4))) &&
    newPosition.x - initPosition.x === direction &&
    newPosition.y - initPosition.y === 1;
  const isMovingDiagonallyFromPalaceRightCorner: boolean =
    (initPosition.isSamePosition(new Position(8, 6)) || initPosition.isSamePosition(new Position(3, 6))) &&
    newPosition.x - initPosition.x === direction &&
    newPosition.y - initPosition.y === -1;
  const isMovingDiagonallyFromPalaceCenter: boolean =
    (initPosition.isSamePosition(new Position(2, 5)) || initPosition.isSamePosition(new Position(9, 5))) &&
    newPosition.x - initPosition.x === direction &&
    Math.abs(newPosition.y - initPosition.y) === 1;

  if (
    isMovingDiagonallyFromPalaceLeftCorner ||
    isMovingDiagonallyFromPalaceRightCorner ||
    isMovingDiagonallyFromPalaceCenter
  ) {
    return true;
  }

  const isMovingOneSpaceUp: boolean = newPosition.x - initPosition.x === direction && newPosition.y === initPosition.y;
  const isMovingOneSpaceAside: boolean =
    Math.abs(newPosition.y - initPosition.y) === 1 && newPosition.x === initPosition.x;

  return isMovingOneSpaceUp || isMovingOneSpaceAside;
};

export const getPossibleSoldierMoves = (soldier: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];
  const direction: number = soldier.country === CountryType.CHO ? 1 : -1;

  // normal move
  const POSITION_NUM = 3;
  const dx: number[] = [direction, 0, 0];
  const dy: number[] = [0, -1, 1];
  const { x: currX, y: currY } = soldier.position;

  // 여기랑 아래랑 내용이 거의 비슷함
  for (let i = 0; i < POSITION_NUM; i++) {
    const position = new Position(currX + dx[i], currY + dy[i]);
    if (isInBoard(position) && !isTileOccupiedByMyCountry(soldier.country, position, board)) {
      possibleMoves.push(position);
    }
  }

  // special move (can move diagonally inside the palace)
  const diagonalMovesInPalace: Position[] = [];

  // 나라 알면 new Position 생성할 필요 없이 아예 궁성 위치 특정해서 옮길 수 있음
  // 나중에 리팩토링
  // 근데 그럼 딥카피해서 줘야 함 PALACE가 바뀌면 안 되니까
  if (soldier.position.isSamePosition(PALACE.han.topRight) || soldier.position.isSamePosition(PALACE.cho.topLeft)) {
    diagonalMovesInPalace.push(new Position(currX + direction, currY + 1));
  } else if (
    soldier.position.isSamePosition(PALACE.han.topLeft) ||
    soldier.position.isSamePosition(PALACE.cho.topRight)
  ) {
    diagonalMovesInPalace.push(new Position(currX + direction, currY - 1));
  } else if (soldier.position.isSamePosition(PALACE.han.center) || soldier.position.isSamePosition(PALACE.cho.center)) {
    diagonalMovesInPalace.push(new Position(currX + direction, currY - 1));
    diagonalMovesInPalace.push(new Position(currX + direction, currY + 1));
  }

  diagonalMovesInPalace.forEach(position => {
    if (isInBoard(position) && !isTileOccupiedByMyCountry(soldier.country, position, board)) {
      possibleMoves.push(position);
    }
  });

  return possibleMoves;
};
