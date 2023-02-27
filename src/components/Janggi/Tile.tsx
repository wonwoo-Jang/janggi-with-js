import { useRef } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { PieceType } from '@customTypes/janggiTypes';

import styles from './Tile.module.scss';

interface TileProps {
  position: Position;
  piece: Piece | null;
  highlight: boolean;
  blocked: boolean;
  selected: boolean;
  onClickTile(position: Position, piece: Piece | null, pieceRef: React.RefObject<HTMLDivElement>): void;
}

export default function Tile({ position, piece, highlight, blocked, selected, onClickTile }: TileProps) {
  const pieceRef = useRef<HTMLDivElement>(null);
  const tileClassName = `${styles.tile} ${highlight && styles.highlight} ${blocked && styles.blocked} ${
    piece && styles.pieceTile
  }`;
  const pieceClassName = piece
    ? `${styles.piece} ${[PieceType.SCHOLAR, PieceType.SOLDIER].includes(piece.type) && styles.small} ${
        selected && styles.selected
      } ${piece.isCheck && styles.check}`
    : '';

  return (
    <div className={tileClassName} onClick={() => onClickTile(position, piece, pieceRef)}>
      {piece && (
        <>
          <div
            className={pieceClassName}
            style={{ backgroundImage: `url(${piece.image})` }}
            ref={pieceRef}
            onClick={() => console.log(position)}
          />
          {piece.isCheck && <CheckBubble />}
        </>
      )}
    </div>
  );
}

function CheckBubble() {
  return (
    <div className={styles.checkBubble}>
      <span>장군!</span>
    </div>
  );
}
