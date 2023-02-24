import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, PieceType } from '@customTypes/janggi';

import JanggiBoard from './JanggiBoard';
import { getPossibleCannonMoves } from './referee/rules/cannonRules';
import { getPossibleCarMoves } from './referee/rules/carRules';
import { getPossibleElephantMoves } from './referee/rules/elephantRules';
import { isTileOccupiedByMyCountry } from './referee/rules/generalRules';
import { getPossibleHorseMove } from './referee/rules/horseRules';
import { getPossibleKingMoves } from './referee/rules/kingRules';
import { getPossibleScholarMoves } from './referee/rules/scholarRules';
import { getPossibleSoldierMoves } from './referee/rules/soldierRules';

export default function Referee() {
  const getPossibleMoves = (piece: Piece, board: Board): Position[] => {
    console.log('getting possible moves');
    switch (piece.type) {
      case PieceType.SOLDIER:
        return getPossibleSoldierMoves(piece, board);
      case PieceType.HORSE:
        return getPossibleHorseMove(piece, board);
      case PieceType.ELEPHANT:
        return getPossibleElephantMoves(piece, board);
      case PieceType.CANNON:
        return getPossibleCannonMoves(piece, board);
      case PieceType.CAR:
        return getPossibleCarMoves(piece, board);
      case PieceType.SCHOLAR:
        return getPossibleScholarMoves(piece, board);
      case PieceType.KING:
        return getPossibleKingMoves(piece, board);
      default:
        return [];
    }
  };

  const isValidMove = (newPosition: Position, piece: Piece, board: Board): boolean => {
    console.log('referee checking valid move');
    if (isTileOccupiedByMyCountry(piece.country, newPosition, board)) return false;
    const isValid = piece.possibleMoves.some(p => p.isSamePosition(newPosition));
    return isValid;
  };

  return <JanggiBoard getPossibleMoves={getPossibleMoves} isValidMove={isValidMove} />;
}
