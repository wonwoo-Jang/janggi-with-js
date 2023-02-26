import { useCallback, useEffect, useState } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType, TileI } from '@customTypes/janggiTypes';

import { ROW_NUM, COLUMNS, ROWS } from '@utils/janggi/constants';
import { isCheck, isTileOccupiedByMyCountry } from '@utils/janggi/rules/generalRules';
import {
  getPossibleCannonMoves,
  getPossibleCarMoves,
  getPossibleElephantMoves,
  getPossibleHorseMove,
  getPossibleKingMoves,
  getPossibleScholarMoves,
  getPossibleSoldierMoves,
} from '@utils/janggi/rules/pieceRules';

import JanggiBoard from './JanggiBoard';

const initialBoard = ROWS.reduce((board, x) => {
  const newRow = COLUMNS.reduce((row, y) => {
    row.push({ position: new Position(x, y), piece: null, highlight: false });
    return row;
  }, [] as TileI[]);
  board.push(newRow);
  return board;
}, [] as Board);

const initPiecesInfo = [
  { type: PieceType.SOLDIER, x: 4, y: [1, 3, 5, 7, 9] },
  { type: PieceType.CANNON, x: 3, y: [2, 8] },
  { type: PieceType.KING, x: 2, y: [5] },
  { type: PieceType.CAR, x: 1, y: [1, 9] },
  { type: PieceType.ELEPHANT, x: 1, y: [2, 7] }, // TODO: table setting options (using modal)
  { type: PieceType.HORSE, x: 1, y: [3, 8] }, // TODO: table setting options (using modal)
  { type: PieceType.SCHOLAR, x: 1, y: [4, 6] },
];

// TODO: determine country randomly
const initialPieces = initPiecesInfo.reduce((pieces, info) => {
  for (const y of info.y) {
    for (const country of [CountryType.CHO, CountryType.HAN]) {
      pieces.push(
        new Piece(
          info.type,
          new Position(country === CountryType.CHO ? info.x : ROW_NUM + 1 - info.x, y),
          country,
          `images/${country}_${info.type}.png`,
        ),
      );
    }
  }
  return pieces;
}, [] as Piece[]);

// in charge of overall game progress
export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);

  const getPossibleMoves = (piece: Piece, board: Board): Position[] => {
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

  // check if the new position is belongs to possible moves
  const isValidMove = (newPosition: Position, piece: Piece, board: Board): boolean => {
    if (isTileOccupiedByMyCountry(piece.country, newPosition, board)) return false;
    const isValid = piece.possibleMoves.some(p => p.isSamePosition(newPosition));
    return isValid;
  };

  const movePiece = (piece: Piece, newPosition: Position, attackedPiece: Piece | null) => {
    piece.setPosition(newPosition); // move selectedPiece to the new position
    const updatedPieces = pieces.reduce((result, p) => {
      // remove attacked piece (filter alive pieces)
      if (!attackedPiece || (attackedPiece && !p.isSamePiece(attackedPiece))) {
        result.push(p);
      }
      return result;
    }, [] as Piece[]);

    setPieces(updatedPieces);
  };

  // check if the king is checked
  const checkKingCheck = (newBoard: Board) => {
    for (const piece of pieces) {
      const possibleMoves = piece.possibleMoves;
      const check = isCheck(piece, possibleMoves, newBoard);
      if (check) alert(`${piece.type}장군!`);
    }
  };

  // update all possible moves depending on the board
  const updatePossibleMoves = (newBoard: Board) => {
    pieces.map(p => {
      p.possibleMoves = getPossibleMoves(p, newBoard);
      return p;
    });
  };

  // update board depending on the pieces
  const updateBoard = useCallback(() => {
    const updatedBoard = board.map(row => {
      return row.map(tile => {
        const piece = pieces.find(p => p.position.isSamePosition(tile.position));
        tile.piece = piece ?? null;
        // tile.highlight = false;
        return tile;
      });
    });
    setBoard(updatedBoard);
    updatePossibleMoves(updatedBoard);
    checkKingCheck(updatedBoard);
  }, [pieces]);

  useEffect(() => {
    updateBoard();
  }, [updateBoard]);

  return <JanggiBoard board={board} isValidMove={isValidMove} movePiece={movePiece} />;
}
