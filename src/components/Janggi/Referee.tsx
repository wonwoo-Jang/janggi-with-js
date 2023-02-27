import { useCallback, useEffect, useMemo, useState } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType, TileI } from '@customTypes/janggiTypes';

import { ROW_NUM, COLUMNS, ROWS } from '@utils/janggi/constants';
import { isTileOccupiedByMyCountry, pieceOccupyingTile } from '@utils/janggi/rules/generalRules';
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
  const [turn, setTurn] = useState<CountryType>(CountryType.CHO);
  const [showCheckModal, setShowCheckModal] = useState<boolean>(false);

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

  const moveTemporarily = (movingPiece: Piece, destination: Position, board: Board) => {
    board[ROW_NUM - movingPiece.position.x][movingPiece.position.y - 1].piece = null; // move from original position
    board[ROW_NUM - destination.x][destination.y - 1].piece = movingPiece; // to destination
    movingPiece.setPosition(destination);
  };

  const revertTemporaryMove = (
    movingPiece: Piece,
    originalPosition: Position,
    originalPiece: Piece | null,
    board: Board,
  ) => {
    board[ROW_NUM - movingPiece.position.x][movingPiece.position.y - 1].piece = originalPiece; // put the original piece back
    board[ROW_NUM - originalPosition.x][originalPosition.y - 1].piece = movingPiece; // revert moved position
    movingPiece.setPosition(originalPosition);
  };

  // 이동 가능 위치를 판별하기 위해 임시로 생성한 boardPreview에서 장군이 나오는지 확인
  const checkKingCheckPreview = (pieces: Piece[], board: Board): boolean => {
    for (const piece of pieces) {
      const poss = getPossibleMoves(piece, board);
      if (isCheck(piece, poss, board)) return true;
    }
    return false;
  };

  // 장군이라서 못가는 자리까지 전부 제외한 이동 가능 위치
  const getExactPossibleMoves = (piece: Piece, board: Board): { possible: Position[]; blocked: Position[] } => {
    const possibleMoves = getPossibleMoves(piece, board);
    const exactPossibleMoves: Position[] = [];
    const blockedMoves: Position[] = [];

    // 나중에 piece도 제대로 클론되도록 변경
    const opponents: Piece[] = pieces.filter(p => p.isOpponent(piece));
    const boardPreview: Board = board.map(row => [...row.map(tile => ({ ...tile }))]); // deep copy (but piece and position are still the original one)
    const movingPiece = piece.clone();

    for (const destination of possibleMoves) {
      const opponent: Piece | null = pieceOccupyingTile(destination, boardPreview); // opponent at destination (if exists)
      moveTemporarily(movingPiece, destination, boardPreview);
      const check = checkKingCheckPreview(
        (opponent && opponents.filter(op => !op.isSamePiece(opponent))) || opponents,
        boardPreview,
      );
      check ? blockedMoves.push(destination) : exactPossibleMoves.push(destination);
      revertTemporaryMove(movingPiece, piece.position, opponent, boardPreview);
    }

    return { possible: exactPossibleMoves, blocked: blockedMoves };
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

  const resetCheck = () => {
    pieces.map(p => (p.isCheck = false));
  };

  // check if the piece has checked the king
  const isCheck = (piece: Piece, possibleMoves: Position[], board: Board): boolean => {
    for (const position of possibleMoves) {
      const opponent: Piece | null = pieceOccupyingTile(position, board);
      if (opponent && opponent.isOpponent(piece) && opponent.isKing()) return true;
    }
    return false;
  };

  // check if the king is checked
  const detectCheck = (newBoard: Board) => {
    resetCheck(); // 장군 새로 확인하기 전에 이전에 있던 값들 초기화
    let check = false;
    for (const piece of pieces) {
      if (isCheck(piece, piece.possibleMoves, newBoard)) {
        piece.isCheck = true;
        check = true;
      }
    }
    if (check) {
      setShowCheckModal(true);
      setTimeout(() => {
        setShowCheckModal(false);
      }, 1500);
    }
  };

  const isCheckmate = (): boolean => {
    return pieces.every(p => p.country !== turn || p.possibleMoves.length === 0);
  };

  // update all possible moves depending on the board
  const updatePossibleAndBlockedMoves = (newBoard: Board) => {
    pieces.map(p => {
      const { possible, blocked } = getExactPossibleMoves(p, newBoard);
      p.possibleMoves = possible;
      p.blockedMoves = blocked;
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
    updatePossibleAndBlockedMoves(updatedBoard);
    if (isCheckmate()) {
      alert('외통!');
      return;
    }
    detectCheck(updatedBoard);
  }, [pieces]);

  useEffect(() => {
    updateBoard();
  }, [updateBoard]);

  return <JanggiBoard board={board} showCheckModal={showCheckModal} isValidMove={isValidMove} movePiece={movePiece} />;
}
