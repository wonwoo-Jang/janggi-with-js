import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, PieceType } from '@customTypes/janggi';

import { isTileOccupiedByMyCountry } from './rules/generalRules';
import { isValidHorseMove } from './rules/horseRules';
import { isValidSoldierMove } from './rules/soldierRules';

export default class Referee {
  isTileOccupied = (position: Position, board: Board) => {
    return Boolean(board[10 - position.x][position.y]);
  };

  isValidMove(newPosition: Position, piece: Piece, board: Board) {
    console.log('referee checking valid move');

    const { type, country, position } = piece;
    if (isTileOccupiedByMyCountry(country, newPosition, board)) return false;

    switch (type) {
      case PieceType.SOLDIER:
        return isValidSoldierMove(newPosition, position, country, board);
      case PieceType.HORSE:
        return isValidHorseMove(newPosition, position, board);
      default:
        return true;
    }
  }

  getPossibleMoves() {
    console.log('getting possible moves');
  }
}
