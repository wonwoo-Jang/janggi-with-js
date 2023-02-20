import { COLUMN_LEN, ROW_LEN } from '@components/Janggi/JanggiBoard';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType } from '@customTypes/janggi';

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
  return board[10 - position.x][position.y - 1].piece;
};

export const isTileOccupied = (position: Position, board: Board): boolean => {
  return Boolean(pieceOccupyingTile(position, board));
};

export const isTileOccupiedByOpponent = (
  myCountry: CountryType,
  position: Position,
  board: Board,
): boolean => {
  const piece = pieceOccupyingTile(position, board);
  return Boolean(piece && piece.country !== myCountry);
};

export const isTileOccupiedByMyCountry = (
  myCountry: CountryType,
  position: Position,
  board: Board,
): boolean => {
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

// isAtCorner
// isAtCenter

export const isNeckBlocked = (
  dx: number,
  dy: number,
  neckNum: number,
  position: Position,
  board: Board,
): boolean => {
  for (let i = 1; i <= neckNum; i++) {
    const neckX = dx < 0 ? i : -i;
    const neckY = dy < 0 ? i : -i;
    const isNeckBlocked = isTileOccupied(
      new Position(position.x + neckX, position.y + neckY),
      board,
    );
    if (isNeckBlocked) return true;
  }
  return false;
};
