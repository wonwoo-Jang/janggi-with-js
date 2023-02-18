import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType } from '@customTypes/janggi';

export const pieceOccupyingTile = (position: Position, board: Board): Piece | null => {
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
