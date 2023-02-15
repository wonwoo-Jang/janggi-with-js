import { Piece } from '@customTypes/janggi';

import styles from './Tile.module.scss';

interface TileProps {
  r: number;
  c: number;
  piece: Piece | null;
}

export default function Tile({ r, c, piece }: TileProps) {
  // 기물 있으면 타일에 기물 컴포넌트 랜더링?
  return <div className={styles.tile}>{piece ? piece.type : `(${r}, ${c})`}</div>;
}
