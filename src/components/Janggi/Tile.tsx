import { Piece } from '@models/Piece';

import { PieceType } from '@customTypes/janggi';

import styles from './Tile.module.scss';

interface TileProps {
  r: number;
  c: number;
  piece: Piece | null;
}

export default function Tile({ r, c, piece }: TileProps) {
  return (
    <div className={styles.tile}>
      {piece && (
        <div
          className={`${styles.piece} ${
            [PieceType.SCHOLAR, PieceType.SOLDIER].includes(piece.type) && styles.small
          }`}
          style={{ backgroundImage: `url(${piece.image})` }}
        ></div>
      )}
    </div>
  );
}
