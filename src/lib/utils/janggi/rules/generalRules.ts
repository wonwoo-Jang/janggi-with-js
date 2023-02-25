import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType } from '@customTypes/janggi';

import { PALACE_X, PALACE_Y, PALACE, DIRECTION_NUM, diagDx, diagDy, COLUMN_NUM, ROW_NUM } from '../constants';

export const isInBoard = (position: Position): boolean => {
  const isValidRangeX: boolean = position.x >= 1 && position.x <= ROW_NUM;
  const isValidRangeY: boolean = position.y >= 1 && position.y <= COLUMN_NUM;
  return isValidRangeX && isValidRangeY;
};

export const pieceOccupyingTile = (position: Position, board: Board): Piece | null => {
  if (!isInBoard(position)) return null;
  return board[ROW_NUM - position.x][position.y - 1].piece;
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
