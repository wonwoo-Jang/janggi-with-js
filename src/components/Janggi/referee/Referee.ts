import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, PieceType } from '@customTypes/janggi';

import { getPossibleCarMoves } from './rules/carRules';
import { getPossibleElephantMoves } from './rules/elephantRules';
import { isTileOccupiedByMyCountry } from './rules/generalRules';
import { getPossibleHorseMove, isValidHorseMove } from './rules/horseRules';
import { getPossibleKingMoves } from './rules/kingRules';
import { getPossibleSoldierMoves, isValidSoldierMove } from './rules/soldierRules';

export default class Referee {
  isValidMove(newPosition: Position, piece: Piece, board: Board): boolean {
    console.log('referee checking valid move');

    const { type, country, position } = piece;
    if (isTileOccupiedByMyCountry(country, newPosition, board)) return false;
    const isValid = piece.possibleMoves.some(p => p.isSamePosition(newPosition));
    return isValid;

    // switch (type) {
    //   case PieceType.SOLDIER:
    //     return isValidSoldierMove(newPosition, position, country, board);
    //   case PieceType.HORSE:
    //     return isValidHorseMove(newPosition, position, board);
    //   default:
    //     return true;
    // }
  }

  getPossibleMoves(piece: Piece, board: Board): Position[] {
    console.log('getting possible moves');
    switch (piece.type) {
      case PieceType.SOLDIER:
        return getPossibleSoldierMoves(piece, board);
      case PieceType.HORSE:
        return getPossibleHorseMove(piece, board);
      case PieceType.ELEPHANT:
        return getPossibleElephantMoves(piece, board);
      case PieceType.CAR:
        return getPossibleCarMoves(piece, board);
      case PieceType.KING:
        return getPossibleKingMoves(piece, board);
      default:
        return [];
    }
  }
}
