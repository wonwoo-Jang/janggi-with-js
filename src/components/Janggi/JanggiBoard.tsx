import { useState } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board } from '@customTypes/janggiTypes';

import { ROW_NUM, COLUMN_NUM, BACK_SLASH_TILES, SLASH_TILES } from '@utils/janggi/constants';

import Tile from './Tile';

import styles from './JanggiBoard.module.scss';

interface JanggiBoardProps {
  board: Board;
  isValidMove(newPosition: Position, piece: Piece, board: Board): boolean;
  movePiece(selectedPiece: Piece, position: Position, clickedPiece: Piece | null): void;
}

// draw board
export default function JanggiBoard({ board, isValidMove, movePiece }: JanggiBoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const selectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
  };

  const resetSelectedPiece = () => {
    setSelectedPiece(null);
  };

  const onClickTile = (position: Position, clickedPiece: Piece | null) => {
    if (selectedPiece && (!clickedPiece || clickedPiece.isOpponent(selectedPiece))) {
      const validMove: boolean = isValidMove(position, selectedPiece, board);
      if (validMove) {
        movePiece(selectedPiece, position, clickedPiece);
      }
      resetSelectedPiece();
    } else if (clickedPiece) {
      if (selectedPiece && clickedPiece.isSamePiece(selectedPiece)) {
        // reset `selectedPiece` if the clicked piece is the same as the previously selected one (toggle)
        resetSelectedPiece();
      } else {
        // select the clicked piece if no piece has been selected yet or the clicked piece is our country (except itself)
        selectPiece(clickedPiece);
      }
    }
  };

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
        {Array((ROW_NUM - 1) * (COLUMN_NUM - 1))
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
              highlight={Boolean(
                selectedPiece && selectedPiece.possibleMoves.some(p => p.isSamePosition(tile.position)),
              )}
              onClickTile={onClickTile}
              key={`${tile.position}`}
            />
          ));
        })}
      </div>
    </div>
  );
}
