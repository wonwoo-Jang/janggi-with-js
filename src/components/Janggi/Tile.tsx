import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { PieceType } from '@customTypes/janggi';

import styles from './Tile.module.scss';

interface TileProps {
  r: number;
  c: number;
  piece: Piece | null;
  onClickTile(position: Position, piece: Piece | null): void;
}

export default function Tile({ r, c, piece, onClickTile }: TileProps) {
  return (
    <div className={styles.tile} onClick={() => onClickTile(new Position(r, c), piece)}>
      {piece && (
        <div
          className={`${styles.piece} ${
            [PieceType.SCHOLAR, PieceType.SOLDIER].includes(piece.type) && styles.small
          }`}
          style={{ backgroundImage: `url(${piece.image})` }}
          onClick={() => console.log(r, c)}
        ></div>
      )}
    </div>
  );
}
