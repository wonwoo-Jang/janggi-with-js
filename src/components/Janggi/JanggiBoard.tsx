import { useState, useEffect, useCallback } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType, TileI } from '@customTypes/janggi';

import Tile from './Tile';

import styles from './JanggiBoard.module.scss';

// TODO: move to `const`
export const ROW_LEN = 10;
export const COLUMN_LEN = 9;
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

interface JanggiBoardProps {
  getPossibleMoves(piece: Piece, board: Board): Position[];
  isValidMove(newPosition: Position, piece: Piece, board: Board): boolean;
}

export default function JanggiBoard({ isValidMove, getPossibleMoves }: JanggiBoardProps) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const initializePossibleMoves = () => {
    pieces.map(p => {
      p.possibleMoves = getPossibleMoves(p, board);
      return p;
    });
  };

  const updateBoard = useCallback((pieces: Piece[], selectedPiece: Piece | null) => {
    const updatedBoard = board.map(row => {
      return row.map(tile => {
        const piece = pieces.find(p => p.position.isSamePosition(tile.position));
        tile.piece = piece ?? null;
        tile.highlight = Boolean(
          selectedPiece && selectedPiece.possibleMoves.some(p => p.isSamePosition(tile.position)),
        );
        return tile;
      });
    });
    setBoard(updatedBoard);
  }, []);

  const selectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
  };

  const resetSelectedPiece = () => {
    setSelectedPiece(null);
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

  const onClickTile = (position: Position, clickedPiece: Piece | null) => {
    if (selectedPiece && (!clickedPiece || clickedPiece.isOpponent(selectedPiece))) {
      const validMove: boolean = isValidMove(position, selectedPiece, board);
      if (validMove) {
        movePiece(selectedPiece, position, clickedPiece);
      }
      resetSelectedPiece();
    } else if (clickedPiece) {
      if (selectedPiece && clickedPiece.isSamePiece(selectedPiece)) {
        // reset `selectedPiece` if the clicked piece is the same as the previously selected one (toggle)
        resetSelectedPiece();
      } else {
        // select the clicked piece if no piece has been selected yet or the clicked piece is our country (except itself)
        selectPiece(clickedPiece);
      }
    }
  };

  useEffect(() => {
    updateBoard(pieces, selectedPiece);
  }, [pieces, selectedPiece, updateBoard]);

  useEffect(() => {
    // TODO:(feat) determine country randomly
    // TODO: (feat) table setting options (using modal)
    initializePossibleMoves();
  }, []);

  // TODO: (refactor) move to `contants.ts`
  const SLASH_TILES = [4, 11, 60, 67];
  const BACK_SLASH_TILES = [3, 12, 59, 68];

  const getLineBoardTileClassName = (index: number) => {
    if (SLASH_TILES.includes(index)) {
      return `${styles.helpTile} ${styles.slash}`;
    } else if (BACK_SLASH_TILES.includes(index)) {
      return `${styles.helpTile} ${styles.backSlash}`;
    } else {
      return styles.helpTile;
    }
  };

  return (
    <div className={styles.janggiBoard}>
      <div className={styles.lineBoard}>
        {Array((ROW_LEN - 1) * (COLUMN_LEN - 1))
          .fill(0)
          .map((v, i) => (
            <div className={getLineBoardTileClassName(i)} key={i} />
          ))}
      </div>
      <div className={styles.squareBoard}>
        {board.map(row => {
          return row.map(tile => (
            <Tile
              position={tile.position}
              piece={tile.piece}
              highlight={tile.highlight}
              onClickTile={onClickTile}
              key={`${tile.position}`}
            />
          ));
        })}
      </div>
    </div>
  );
}
