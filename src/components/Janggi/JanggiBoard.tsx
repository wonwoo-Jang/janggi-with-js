import { useState, useEffect, useCallback } from 'react';

import { Piece } from '@models/Piece';

import { CountryType, PieceType, Position } from '@customTypes/janggi';

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
        initPieces.push(
          new Piece(
            p.type,
            { r: country === CountryType.CHO ? p.r : ROW_LEN + 1 - p.r, c: c },
            country,
            `images/${country}_${p.type}.png`,
          ),
        );
      });
    });
  }

  return initPieces;
};

export default function JanggiBoard() {
  const [board, setBoard] = useState<{ position: Position; piece: Piece | null }[][]>([]);
  const [pieces, setPieces] = useState<Piece[]>(getInitPieces());

  const initializeBoard = useCallback(() => {
    const initBoard: { position: Position; piece: Piece | null }[][] = [];

    rows.forEach(r => {
      const row: { position: Position; piece: Piece | null }[] = [];

      columns.forEach(c => {
        const position: Position = { r, c };
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
  }, []);

  const getLineBoardTileClassName = (index: number) => {
    if ([4, 11, 60, 67].includes(index)) {
      return `${styles.helpTile} ${styles.slash}`;
    } else if ([3, 12, 59, 68].includes(index)) {
      return `${styles.helpTile} ${styles.backSlash}`;
    } else {
      return styles.helpTile;
    }
  };

  useEffect(() => {
    // TODO: determine country randomly
    // TODO: table setting options (use modal)
    initializeBoard();
  }, [initializeBoard]);

  return (
    <div className={styles.janggiBoard}>
      <div className={styles.backgroundBoard}>
        {Array((ROW_LEN + 1) * (COL_LEN + 1))
          .fill(0)
          .map((v, i) => (
            <div className={styles.helpTile} key={i} />
          ))}
      </div>
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
              r={tile.position.r}
              c={tile.position.c}
              piece={tile.piece}
              key={`(${tile.position.r}, ${tile.position.c})`}
            />
          ));
        })}
      </div>
    </div>
  );
}
