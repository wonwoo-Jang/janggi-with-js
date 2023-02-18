import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { PieceType } from '@customTypes/janggi';

import styles from './Tile.module.scss';

interface TileProps {
  position: Position;
  piece: Piece | null;
  onClickTile(position: Position, piece: Piece | null): void;
}

export default function Tile({ position, piece, onClickTile }: TileProps) {
  return (
    <div className={styles.tile} onClick={() => onClickTile(position, piece)}>
      {piece && (
        <div
          className={`${styles.piece} ${
            [PieceType.SCHOLAR, PieceType.SOLDIER].includes(piece.type) && styles.small
          }`}
          style={{ backgroundImage: `url(${piece.image})` }}
          onClick={() => console.log(position)}
        ></div>
      )}
    </div>
  );
}
