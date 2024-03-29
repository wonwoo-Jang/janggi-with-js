import React, { Dispatch, SetStateAction, useState } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType } from '@customTypes/janggiTypes';

import { ROW_NUM, COLUMN_NUM, BACK_SLASH_TILES, SLASH_TILES, TABLE_SETTING_OPTIONS } from '@utils/janggi/constants';

import CheckModal from './CheckModal';
import TableSettingModal from './TableSettingModal';
import Tile from './Tile';

import styles from './JanggiBoard.module.scss';

interface JanggiBoardProps {
  board: Board;
  turn: CountryType;
  showCheckModal: boolean;
  tableSetting: PieceType[];
  setTableSetting: Dispatch<SetStateAction<PieceType[]>>;
  movePiece(selectedPiece: Piece, position: Position, clickedPiece: Piece | null): void;
}

// draw board mainly
export default function JanggiBoard({
  board,
  turn,
  showCheckModal,
  tableSetting,
  setTableSetting,
  movePiece,
}: JanggiBoardProps) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedRef, setSelectedRef] = useState<React.RefObject<HTMLDivElement> | null>(null); // for move effect

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

    const diffX = selectedPiece.position.x - destination.x;
    const diffY = destination.y - selectedPiece.position.y;
    let translatePosition = '0';

    if (diffX && diffY) {
      // diagonal move
      translatePosition = `calc(80vh * 0.1 * ${diffY}) calc(80vh * 0.1 * ${diffX})`;
    } else if (diffX) {
      // vertical move
      translatePosition = `0 calc(80vh * 0.1 * ${diffX})`;
    } else if (diffY) {
      // horizontal move
      translatePosition = `calc(80vh * 0.1 * ${diffY}) 0`;
    }

    // move
    const $pieceDiv = selectedRef.current;
    $pieceDiv.style.zIndex = '10';
    $pieceDiv.style.translate = translatePosition;

    // jump
    if (selectedPiece.isJumping()) {
      $pieceDiv.style.scale = '1.8';
      // shrink from the midpoint
      setTimeout(() => {
        $pieceDiv.style.scale = '1';
      }, 180);
    }

    // update board after move effect
    setTimeout(() => {
      movePiece(selectedPiece, destination, clickedPiece);
    }, 500);
  };

  const onClickTile = (position: Position, clickedPiece: Piece | null, pieceRef: React.RefObject<HTMLDivElement>) => {
    // previously selected piece exists, and seems movable to the destination (no piece or opponent at the destination)
    if (selectedPiece && (!clickedPiece || clickedPiece.isOpponent(selectedPiece))) {
      // if the destination is in the range of possibleMoves, it's valid
      const validMove: boolean = selectedPiece.possibleMoves.some(p => p.isSamePosition(position));
      if (validMove) moveSmoothly(position, clickedPiece);
      resetSelectedPiece();
    } else if (clickedPiece) {
      if (selectedPiece && clickedPiece.isSamePiece(selectedPiece)) {
        // reset `selectedPiece` if the clicked piece is the same as the previously selected one (toggle)
        resetSelectedPiece();
      } else if (clickedPiece.country === turn) {
        // select the clicked piece if no piece has been selected yet and the clicked piece is our country (except itself)
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
              blocked={Boolean(selectedPiece && selectedPiece.blockedMoves.some(p => p.isSamePosition(tile.position)))}
              selected={Boolean(selectedPiece && tile.piece?.isSamePiece(selectedPiece))}
              onClickTile={onClickTile}
              key={`${tile.position}`}
            />
          ));
        })}
      </div>
      {showCheckModal && <CheckModal />}
      {!tableSetting.length ? (
        <TableSettingModal
          myCountry={CountryType.CHO}
          opponentTableSetting={TABLE_SETTING_OPTIONS[0]}
          setTableSetting={setTableSetting}
        />
      ) : null}
    </div>
  );
}
