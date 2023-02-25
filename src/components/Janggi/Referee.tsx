import { useCallback, useEffect, useState } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType, TileI } from '@customTypes/janggi';

import JanggiBoard, { COLUMN_LEN, ROW_LEN } from './JanggiBoard';
import { getPossibleCannonMoves } from './referee/rules/cannonRules';
import { getPossibleCarMoves } from './referee/rules/carRules';
import { getPossibleElephantMoves } from './referee/rules/elephantRules';
import { isTileOccupiedByMyCountry } from './referee/rules/generalRules';
import { getPossibleHorseMove } from './referee/rules/horseRules';
import { getPossibleKingMoves } from './referee/rules/kingRules';
import { getPossibleScholarMoves } from './referee/rules/scholarRules';
import { getPossibleSoldierMoves } from './referee/rules/soldierRules';

const rows = Array.from({ length: ROW_LEN }, (v, i) => ROW_LEN - i);
const columns = Array.from({ length: COLUMN_LEN }, (v, i) => i + 1);

// TODO: move to `const`
const initialBoard = rows.reduce((board, x) => {
  const newRow = columns.reduce((row, y) => {
    row.push({ position: new Position(x, y), piece: null, highlight: false });
    return row;
  }, [] as TileI[]);
  board.push(newRow);
  return board;
}, [] as Board);

// TODO: move to `const`
const initPiecesInfo = [
  { type: PieceType.SOLDIER, x: 4, y: [1, 3, 5, 7, 9] },
  { type: PieceType.CANNON, x: 3, y: [2, 8] },
  { type: PieceType.KING, x: 2, y: [5] },
  { type: PieceType.CAR, x: 1, y: [1, 9] },
  { type: PieceType.ELEPHANT, x: 1, y: [2, 7] }, // TODO: (feat) change depending on user's choice
  { type: PieceType.HORSE, x: 1, y: [3, 8] }, // TODO: (feat) change depending on user's choice
  { type: PieceType.SCHOLAR, x: 1, y: [4, 6] },
];

// TODO: move to `const`
const initialPieces = initPiecesInfo.reduce((pieces, info) => {
  for (const y of info.y) {
    for (const country of [CountryType.CHO, CountryType.HAN]) {
      pieces.push(
        new Piece(
          info.type,
          new Position(country === CountryType.CHO ? info.x : ROW_LEN + 1 - info.x, y),
          country,
          `images/${country}_${info.type}.png`,
        ),
      );
    }
  }
  return pieces;
}, [] as Piece[]);

// update board
export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);

  const initializePossibleMoves = () => {
    pieces.map(p => {
      p.possibleMoves = getPossibleMoves(p, board);
      return p;
    });
  };

  const updateBoard = useCallback((pieces: Piece[]) => {
    const updatedBoard = board.map(row => {
      return row.map(tile => {
        const piece = pieces.find(p => p.position.isSamePosition(tile.position));
        tile.piece = piece ?? null;
        tile.highlight = false;
        return tile;
      });
    });
    setBoard(updatedBoard);
  }, []);

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

  // 실제 보드를 바꾸면 일부만 먼저 랜더링이 되어 깜박임 현상이 발생함
  // 따라서 복사본을 이용해 이동 가능 경로만 따로 업데이트
  const getBoardPreview = (movedPiece: Piece, newPosition: Position) => {
    const boardPreview: Board = board.map(row => row.map(tile => ({ ...tile }))); // deep copy
    boardPreview[ROW_LEN - movedPiece.position.x][movedPiece.position.y - 1].piece = null;
    boardPreview[ROW_LEN - newPosition.x][newPosition.y - 1].piece = movedPiece;
    return boardPreview;
  };

  const movePiece = (piece: Piece, newPosition: Position, attackedPiece: Piece | null) => {
    piece.setPosition(newPosition); // move selectedPiece to the new position
    const boardPreview = getBoardPreview(piece, newPosition);
    const updatedPieces = pieces.reduce((result, p) => {
      // update all possible moves and remove attacked piece (filter alive pieces)
      if (!attackedPiece || (attackedPiece && !p.isSamePiece(attackedPiece))) {
        p.possibleMoves = getPossibleMoves(p, boardPreview);
        result.push(p);
      }
      return result;
    }, [] as Piece[]);

    setPieces(updatedPieces);
  };

  useEffect(() => {
    updateBoard(pieces);
  }, [pieces, updateBoard]);

  useEffect(() => {
    // TODO:(feat) determine country randomly
    // TODO: (feat) table setting options (using modal)
    initializePossibleMoves();
  }, []);

  return <JanggiBoard board={board} isValidMove={isValidMove} movePiece={movePiece} />;
}
