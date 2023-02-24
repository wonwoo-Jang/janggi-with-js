import { COLUMN_LEN, ROW_LEN } from '@components/Janggi/JanggiBoard';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType } from '@customTypes/janggi';

export const PALACE = {
  [CountryType.CHO]: {
    topLeft: new Position(3, 4),
    topRight: new Position(3, 6),
    bottomLeft: new Position(1, 4),
    bottomRight: new Position(1, 6),
    center: new Position(2, 5),
  },
  [CountryType.HAN]: {
    topLeft: new Position(8, 6),
    topRight: new Position(8, 4),
    center: new Position(9, 5),
    bottomLeft: new Position(10, 6),
    bottomRight: new Position(10, 4),
  },
};

export const isInBoard = (position: Position): boolean => {
  const isValidRangeX: boolean = position.x >= 1 && position.x <= ROW_LEN;
  const isValidRangeY: boolean = position.y >= 1 && position.y <= COLUMN_LEN;
  return isValidRangeX && isValidRangeY;
};

export const pieceOccupyingTile = (position: Position, board: Board): Piece | null => {
  if (!isInBoard(position)) return null;
  return board[ROW_LEN - position.x][position.y - 1].piece;
};

export const isTileOccupied = (position: Position, board: Board): boolean => {
  return Boolean(pieceOccupyingTile(position, board));
};

export const isTileOccupiedByOpponent = (myCountry: CountryType, position: Position, board: Board): boolean => {
  const piece = pieceOccupyingTile(position, board);
  return Boolean(piece && piece.country !== myCountry);
};

export const isTileOccupiedByMyCountry = (myCountry: CountryType, position: Position, board: Board): boolean => {
  const occupyingPiece = pieceOccupyingTile(position, board);
  return Boolean(occupyingPiece && occupyingPiece.country === myCountry);
};

// 리팩토링 안되나 이거
const PALACE_POSITIONS: Position[] = [
  new Position(1, 4),
  new Position(1, 6),
  new Position(2, 5),
  new Position(3, 4),
  new Position(3, 6),
  new Position(8, 4),
  new Position(8, 6),
  new Position(9, 5),
  new Position(10, 4),
  new Position(10, 6),
];

const PALACE_X: number[] = [1, 2, 3, 8, 9, 10];
const PALACE_Y: number[] = [4, 5, 6];

export const isInPalace = (position: Position): boolean => {
  const isXInPalace: boolean = PALACE_X.includes(position.x);
  const isYInPalace: boolean = PALACE_Y.includes(position.y);
  return isXInPalace && isYInPalace;
};

// TODO: isAtPalaceCorner
// TODO: isAtPalaceCenter

export const isNeckBlocked = (dx: number, dy: number, neckNum: number, position: Position, board: Board): boolean => {
  for (let i = 1; i <= neckNum; i++) {
    const neckX = dx < 0 ? i : -i;
    const neckY = dy < 0 ? i : -i;
    const isNeckBlocked = isTileOccupied(new Position(position.x + neckX, position.y + neckY), board);
    if (isNeckBlocked) return true;
  }
  return false;
};

export const linearDx = [1, -1, 0, 0];
export const linearDy = [0, 0, -1, 1];

export const diagDx = [1, 1, -1, -1];
export const diagDy = [1, -1, 1, -1];
export const CORNER_NUM = 4;
export const DIRECTION_NUM = 4;
export const palaceCornerPositions: Position[][] = [
  [PALACE.cho.bottomLeft, PALACE.han.topRight],
  [PALACE.cho.bottomRight, PALACE.han.topLeft],
  [PALACE.cho.topLeft, PALACE.han.bottomRight],
  [PALACE.cho.topRight, PALACE.han.bottomLeft],
];

export const getPalaceCenterDiagonalMoves = (piece: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];

  if (piece.position.isSamePosition(PALACE.cho.center) || piece.position.isSamePosition(PALACE.han.center)) {
    for (let i = 0; i < DIRECTION_NUM; i++) {
      const position: Position = new Position(piece.position.x + diagDx[i], piece.position.y + diagDy[i]);
      if (!isTileOccupiedByMyCountry(piece.country, position, board)) {
        possibleMoves.push(position);
      }
    }
  }

  return possibleMoves;
};
