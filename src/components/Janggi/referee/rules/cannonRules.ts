import { COLUMN_LEN, ROW_LEN } from '@components/Janggi/JanggiBoard';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType } from '@customTypes/janggi';

import { isInBoard, isTileOccupied, pieceOccupyingTile } from './generalRules';

// 포다리 찾는 함수
const getBridge = (
  dx: number, // direction of x to move (down: -1, up: 1)
  dy: number, // direction of y to move (left: -1, right: 1)
  maxDistance: number,
  cannon: Piece,
  board: Board,
): Piece | null => {
  let bridge: Piece | null = null;
  const { x: currX, y: currY } = cannon.position;
  for (let i = 1; i <= maxDistance; i++) {
    const position = new Position(currX + i * dx, currY + i * dy);
    bridge = pieceOccupyingTile(position, board);
    if (bridge) break;
  }

  // cannon can not be a bridge
  return bridge?.type !== PieceType.CANNON ? bridge : null;
};

// almost the same as `getLinearMoves` function in `carRules.ts`
// TODO: integrate `getLinearMoves` in cannonRules carRules
const getLinearMoves = (
  dx: number, // direction of x to move (down: -1, up: 1)
  dy: number, // direction of y to move (left: -1, right: 1)
  maxDistance: number,
  myCountry: CountryType,
  bridge: Piece,
  board: Board,
): Position[] => {
  const linearMoves: Position[] = [];
  const { x: currX, y: currY } = bridge.position;

  // i: distance from current position
  for (let i = 1; i <= maxDistance; i++) {
    const position = new Position(currX + i * dx, currY + i * dy);
    if (!isInBoard(position)) break;

    if (!isTileOccupied(position, board)) {
      // destination is empty
      linearMoves.push(position);
    } else {
      const occupyingPiece: Piece = pieceOccupyingTile(position, board) as Piece;
      if (occupyingPiece.country !== myCountry && occupyingPiece.type !== PieceType.CANNON) {
        // oppenent except cannon is at the destination
        linearMoves.push(position);
      }
      break;
    }
  }
  return linearMoves;
};

export const getPossibleCannonMoves = (cannon: Piece, board: Board): Position[] => {
  const possibleMoves: Position[] = [];

  // linear moves
  const directions = [1, -1];
  for (const d of directions) {
    const verticalBridge = getBridge(d, 0, ROW_LEN - 1, cannon, board);
    if (verticalBridge) {
      const verticalMoves = getLinearMoves(
        d,
        0,
        ROW_LEN - 1,
        cannon.country,
        verticalBridge,
        board,
      );
      possibleMoves.push(...verticalMoves);
    }

    const horizontalBridge = getBridge(0, d, COLUMN_LEN - 1, cannon, board);
    if (horizontalBridge) {
      const horizontalMoves = getLinearMoves(
        0,
        d,
        COLUMN_LEN - 1,
        cannon.country,
        horizontalBridge,
        board,
      );
      possibleMoves.push(...horizontalMoves);
    }
  }

  return possibleMoves;
};
