import { useState, useEffect, useCallback } from 'react';

import { CountryType, Piece, PieceType } from '@customTypes/janggi';

import Tile from './Tile';

import styles from './JanggiBoard.module.scss';

const ROW_LEN = 10;
const COL_LEN = 9;
const rows = Array.from({ length: ROW_LEN }, (v, i) => ROW_LEN - i);
const columns = Array.from({ length: COL_LEN }, (v, i) => i + 1);

const getInitPieces = () => {
  const initPieces: Piece[] = [];

  for (const country of [CountryType.CHO, CountryType.HAN]) {
    const pieces = [
      { type: PieceType.SOLDIER, r: 4, c: [1, 3, 5, 7, 9] },
      { type: PieceType.CANNON, r: 3, c: [2, 8] },
      { type: PieceType.KING, r: 2, c: [5] },
      { type: PieceType.CAR, r: 1, c: [1, 9] },
      { type: PieceType.ELEPHANT, r: 1, c: [2, 7] }, // TODO: change depending on user's choice
      { type: PieceType.HORSE, r: 1, c: [3, 8] }, // TODO: change depending on user's choice
      { type: PieceType.SCHOLAR, r: 1, c: [4, 6] },
    ];

    pieces.forEach(p => {
      p.c.forEach(c => {
        initPieces.push({
          type: p.type,
          position: { r: country === CountryType.CHO ? p.r : ROW_LEN + 1 - p.r, c: c },
          country: country,
          image: `images/${country}_${p.type}.png`,
        });
      });
    });
  }

  return initPieces;
};

export default function JanggiBoard() {
  const [board, setBoard] = useState<{ r: number; c: number; piece: Piece | null }[][]>([]);
  const [pieces, setPieces] = useState<Piece[]>(getInitPieces());

  const initializeBoard = useCallback(() => {
    const initBoard: { r: number; c: number; piece: Piece | null }[][] = [];

    rows.forEach(r => {
      const row: { r: number; c: number; piece: Piece | null }[] = [];
      columns.forEach(c => {
        let piece: Piece | null = null;
        pieces.forEach(p => {
          if (p.position.r === r && p.position.c === c) {
            piece = p;
          }
        });
        row.push({ r, c, piece });
      });
      initBoard.push(row);
    });

    setBoard(initBoard);
  }, []);

  useEffect(() => {
    // TODO: determine country randomly
    // TODO: table setting options (use modal)
    initializeBoard();
  }, []);

  return (
    <div className={styles.janggiBoard}>
      <div className={styles.lineBoard}>
        {Array(110)
          .fill(0)
          .map((v, i) => (
            <div className={styles.helpTile} key={i} />
          ))}
      </div>
      <div className={styles.borderBoard}>
        {Array(72)
          .fill(0)
          .map((v, i) => (
            <div className={styles.helpTile} key={i} />
          ))}
      </div>
      <div className={styles.squareBoard}>
        {board.map(row => {
          return row.map(tile => (
            <Tile r={tile.r} c={tile.c} piece={tile.piece} key={`${tile.r}_${tile.c}`} />
          ));
        })}
      </div>
    </div>
  );
}
