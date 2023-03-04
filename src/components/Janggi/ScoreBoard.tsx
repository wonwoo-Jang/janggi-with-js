import { Piece } from '@models/Piece';

import { PieceType } from '@customTypes/janggiTypes';

import styles from './ScoreBoard.module.scss';

interface ScoreBoardProps {
  scoreBoard: { deadOpponentPieces: Piece[]; score: number };
}

export default function ScoreBoard({ scoreBoard }: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoard}>
      <span className={styles.score}>{scoreBoard.score}</span>
      <div className={styles.deadPieces}>
        {scoreBoard.deadOpponentPieces.map((p, i) => (
          <div
            className={`${styles.deadPiece} 
          ${[PieceType.SCHOLAR, PieceType.SOLDIER].includes(p.type) && styles.small}
          `}
            style={{ backgroundImage: `url(${p.image})` }}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
