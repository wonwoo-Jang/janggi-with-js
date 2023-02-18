import { useState, useEffect, useCallback } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType, TileI } from '@customTypes/janggi';

import Referee from './referee/Referee';
import Tile from './Tile';

import styles from './JanggiBoard.module.scss';

const ROW_LEN = 10;
const COL_LEN = 9;
const rows = Array.from({ length: ROW_LEN }, (v, i) => ROW_LEN - i);
const columns = Array.from({ length: COL_LEN }, (v, i) => i + 1);

const initializeBoard = () => {
  const initBoard: Board = [];
  rows.forEach(x => {
    const row: TileI[] = [];
    columns.forEach(y => {
      row.push({ position: new Position(x, y), piece: null });
    });
    initBoard.push(row);
  });
  return initBoard;
};

export default function JanggiBoard() {
  const [board, setBoard] = useState<Board>(initializeBoard());
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const referee = new Referee();

  const initializePieces = useCallback(() => {
    const initPieces: Piece[] = [];

    for (const country of [CountryType.CHO, CountryType.HAN]) {
      const initPiecesInfo = [
        { type: PieceType.SOLDIER, x: 4, y: [1, 3, 5, 7, 9] },
        { type: PieceType.CANNON, x: 3, y: [2, 8] },
        { type: PieceType.KING, x: 2, y: [5] },
        { type: PieceType.CAR, x: 1, y: [1, 9] },
        { type: PieceType.ELEPHANT, x: 1, y: [2, 7] }, // TODO: (feat) change depending on user's choice
        { type: PieceType.HORSE, x: 1, y: [3, 8] }, // TODO: (feat) change depending on user's choice
        { type: PieceType.SCHOLAR, x: 1, y: [4, 6] },
      ];

      initPiecesInfo.forEach(p => {
        p.y.forEach(y => {
          initPieces.push(
            new Piece(
              p.type,
              new Position(country === CountryType.CHO ? p.x : ROW_LEN + 1 - p.x, y),
              country,
              `images/${country}_${p.type}.png`,
            ),
          );
        });
      });
    }

    setPieces(initPieces);
  }, []);

  const updateBoard = useCallback((pieces: Piece[]) => {
    const updatedBoard = board.map(row => {
      return row.map(tile => {
        const piece = pieces.find(p => p.position.isSamePosition(tile.position));
        tile.piece = piece ?? null;
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

  const movePiece = (piece: Piece, newPosition: Position, attackedPiece: Piece | null) => {
    const updatedPieces = pieces.reduce((result, p) => {
      if (p.isSamePiece(piece)) {
        // move selectedPiece to new position
        p.setPosition(newPosition);
      }
      if (!attackedPiece || (attackedPiece && !p.isSamePiece(attackedPiece))) {
        // remove attacked piece (filter alive pieces)
        result.push(p);
      }
      return result;
    }, [] as Piece[]);

    setPieces(updatedPieces);
  };

  const onClickTile = (position: Position, clickedPiece: Piece | null) => {
    if (selectedPiece && (!clickedPiece || clickedPiece.isOpponent(selectedPiece))) {
      const isValidMove: boolean = referee.isValidMove(position, selectedPiece, board);
      if (isValidMove) {
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
    updateBoard(pieces);
  }, [pieces, updateBoard]);

  useEffect(() => {
    // TODO:(feat) determine country randomly
    // TODO: (feat) table setting options (using modal)
    initializePieces();
  }, [initializePieces]);

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
        {Array((ROW_LEN - 1) * (COL_LEN - 1))
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
              onClickTile={onClickTile}
              key={`${tile.position}`}
            />
          ));
        })}
      </div>
    </div>
  );
}
