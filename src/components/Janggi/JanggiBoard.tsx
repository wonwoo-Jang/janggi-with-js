import React, { useState } from 'react';

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
  const [selectedRef, setSelectedRef] = useState<React.RefObject<HTMLDivElement> | null>(null);

  const selectPiece = (piece: Piece, pieceRef: React.RefObject<HTMLDivElement>) => {
    setSelectedPiece(piece);
    setSelectedRef(pieceRef);
  };

  const resetSelectedPiece = () => {
    setSelectedPiece(null);
    setSelectedRef(null);
  };

  const moveSmoothly = (destination: Position, clickedPiece: Piece | null) => {
    if (!selectedPiece || !selectedRef?.current) return;

    if (selectedPiece.isSliding()) {
      const diffX = selectedPiece.position.x - destination.x;
      const diffY = destination.y - selectedPiece.position.y;
      const translatePosition = `translate${diffX ? 'Y' : 'X'}(calc(80vh * 0.1 * ${diffX || diffY}))`;
      const $pieceDiv = selectedRef.current;
      $pieceDiv.style.transform = translatePosition;
      $pieceDiv.style.zIndex = '10';
    } else {
      console.log('jump!');
    }

    // update board after move effect
    setTimeout(() => {
      movePiece(selectedPiece, destination, clickedPiece);
    }, 300);
  };

  const onClickTile = (position: Position, clickedPiece: Piece | null, pieceRef: React.RefObject<HTMLDivElement>) => {
    if (selectedPiece && (!clickedPiece || clickedPiece.isOpponent(selectedPiece))) {
      const validMove: boolean = isValidMove(position, selectedPiece, board);
      if (validMove) {
        moveSmoothly(position, clickedPiece);
      }
      resetSelectedPiece();
    } else if (clickedPiece) {
      if (selectedPiece && clickedPiece.isSamePiece(selectedPiece)) {
        // reset `selectedPiece` if the clicked piece is the same as the previously selected one (toggle)
        resetSelectedPiece();
      } else {
        // select the clicked piece if no piece has been selected yet or the clicked piece is our country (except itself)
        selectPiece(clickedPiece, pieceRef);
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
              selected={Boolean(selectedPiece && tile.piece?.isSamePiece(selectedPiece))}
              onClickTile={onClickTile}
              key={`${tile.position}`}
            />
          ));
        })}
      </div>
    </div>
  );
}
