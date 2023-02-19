import { COLUMN_LEN, ROW_LEN } from '@components/Janggi/JanggiBoard';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType } from '@customTypes/janggi';

export const isInBoard = (position: Position): boolean => {
  const isValidRangeX: boolean = position.x >= 1 && position.x <= ROW_LEN;
  const isValidRangeY: boolean = position.y >= 1 && position.y <= COLUMN_LEN;
  return isValidRangeX && isValidRangeY;
};

export const pieceOccupyingTile = (position: Position, board: Board): Piece | null => {
  if (!isInBoard(position)) return null;
  return board[10 - position.x][position.y - 1].piece;
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

export const isInPalace = (position: Position): boolean => {
  return PALACE_POSITIONS.some(p => position.isSamePosition(p));
};

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
    const isNeckBlocked = Boolean(
      pieceOccupyingTile(new Position(position.x + neckX, position.y + neckY), board),
    );
    if (isNeckBlocked) return true;
  }
  return false;
};
