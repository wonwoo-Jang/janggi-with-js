import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { PieceType } from '@customTypes/janggi';

import styles from './Tile.module.scss';

interface TileProps {
  position: Position;
  piece: Piece | null;
  highlight: boolean;
  onClickTile(position: Position, piece: Piece | null): void;
}

export default function Tile({ position, piece, highlight, onClickTile }: TileProps) {
  const tileClassName = `${styles.tile} ${highlight && styles.highlight}`;
  const pieceClassName = piece
    ? `${styles.piece} ${
        [PieceType.SCHOLAR, PieceType.SOLDIER].includes(piece.type) && styles.small
      }`
    : '';

  return (
    <div className={tileClassName} onClick={() => onClickTile(position, piece)}>
      {piece && (
        <div
          className={pieceClassName}
          style={{ backgroundImage: `url(${piece.image})` }}
          onClick={() => console.log(position)}
        ></div>
      )}
    </div>
  );
}
