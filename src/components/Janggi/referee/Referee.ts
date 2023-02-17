import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { PieceType } from '@customTypes/janggi';

import { isValidSoldierMove } from './rules/soldierRules';

export default class Referee {
  isTileOccupied = (position: Position, board: { position: Position; piece: Piece | null }[][]) => {
    return Boolean(board[10 - position.r][position.c]);
  };

  isValidMove(
    newPosition: Position,
    piece: Piece,
    board: { position: Position; piece: Piece | null }[][],
  ) {
    console.log('referee checking valid move');

    const { type, country, position } = piece;
    switch (type) {
      case PieceType.SOLDIER:
        return isValidSoldierMove(newPosition, position, country, board);
      default:
        return true;
    }
  }

  getPossibleMoves() {
    console.log('getting possible moves');
  }
}
