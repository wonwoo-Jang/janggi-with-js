import { useState, useEffect, useCallback } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { CountryType, PieceType } from '@customTypes/janggi';

import Referee from './referee/Referee';
import Tile from './Tile';

import styles from './JanggiBoard.module.scss';

const ROW_LEN = 10;
const COL_LEN = 9;
const rows = Array.from({ length: ROW_LEN }, (v, i) => ROW_LEN - i);
const columns = Array.from({ length: COL_LEN }, (v, i) => i + 1);

export default function JanggiBoard() {
  const [board, setBoard] = useState<{ position: Position; piece: Piece | null }[][]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const referee = new Referee();

  const initializePieces = useCallback(() => {
    const initPieces: Piece[] = [];

    for (const country of [CountryType.CHO, CountryType.HAN]) {
      const initPiecesInfo = [
        { type: PieceType.SOLDIER, r: 4, c: [1, 3, 5, 7, 9] },
        { type: PieceType.CANNON, r: 3, c: [2, 8] },
        { type: PieceType.KING, r: 2, c: [5] },
        { type: PieceType.CAR, r: 1, c: [1, 9] },
        { type: PieceType.ELEPHANT, r: 1, c: [2, 7] }, // TODO: (feat) change depending on user's choice
        { type: PieceType.HORSE, r: 1, c: [3, 8] }, // TODO: (feat) change depending on user's choice
        { type: PieceType.SCHOLAR, r: 1, c: [4, 6] },
      ];

      initPiecesInfo.forEach(p => {
        p.c.forEach(c => {
          initPieces.push(
            new Piece(
              p.type,
              new Position(country === CountryType.CHO ? p.r : ROW_LEN + 1 - p.r, c),
              country,
              `images/${country}_${p.type}.png`,
            ),
          );
        });
      });
    }

    setPieces(initPieces);
  }, []);

  // TODO: (refactor) separate initailzing and updating
  const updateBoard = useCallback(
    (pieces: Piece[]) => {
      const initBoard: { position: Position; piece: Piece | null }[][] = [];

      rows.forEach(r => {
        const row: { position: Position; piece: Piece | null }[] = [];

        columns.forEach(c => {
          const position: Position = new Position(r, c);
          let piece: Piece | null = null;

          pieces.forEach(p => {
            if (p.position.r === r && p.position.c === c) {
              piece = p;
            }
          });

          row.push({ position, piece });
        });

        initBoard.push(row);
      });

      setBoard(initBoard);
    },
    [pieces],
  );

  const grabPiece = (piece: Piece) => {
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

  const dropPiece = (piece: Piece, newPositon: Position, attackedPiece: Piece | null) => {
    const isValidMove: boolean = referee.isValidMove(newPositon, piece, board);
    if (isValidMove) {
      movePiece(piece, newPositon, attackedPiece);
    }
    resetSelectedPiece();
  };

  const onClickTile = (position: Position, clickedPiece: Piece | null) => {
    if (clickedPiece && (!selectedPiece || !clickedPiece.isOpponent(selectedPiece))) {
      // grab the clicked piece if no piece has been selected yet or the clicked piece is our country
      grabPiece(clickedPiece);
    } else if (selectedPiece) {
      if (clickedPiece && clickedPiece.isSamePiece(selectedPiece)) {
        // reset `selectedPiece` if the clicked piece is the same as the previously selected one (toggle)
        resetSelectedPiece();
      } else {
        // (attack and) move
        dropPiece(selectedPiece, position, clickedPiece);
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
