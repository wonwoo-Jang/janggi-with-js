import { Position } from '@models/Position';

import { CountryType } from '@customTypes/janggiTypes';

export const ROW_NUM = 10;
export const COLUMN_NUM = 9;

export const ROWS = Array.from({ length: ROW_NUM }, (v, i) => ROW_NUM - i);
export const COLUMNS = Array.from({ length: COLUMN_NUM }, (v, i) => i + 1);

export const SLASH_TILES = [4, 11, 60, 67];
export const BACK_SLASH_TILES = [3, 12, 59, 68];

export const PALACE = {
  [CountryType.CHO]: {
    topLeft: new Position(3, 4),
    topRight: new Position(3, 6),
    bottomLeft: new Position(1, 4),
    bottomRight: new Position(1, 6),
    center: new Position(2, 5),
  },
  [CountryType.HAN]: {
    topLeft: new Position(8, 6),
    topRight: new Position(8, 4),
    center: new Position(9, 5),
    bottomLeft: new Position(10, 6),
    bottomRight: new Position(10, 4),
  },
};

// 리팩토링 안되나 이거
const PALACE_POSITIONS: Position[] = [
  new Position(1, 4),
  new Position(1, 6),
  new Position(2, 5),
  new Position(3, 4),
  new Position(3, 6),
  new Position(8, 4),
  new Position(8, 6),
  new Position(9, 5),
  new Position(10, 4),
  new Position(10, 6),
];

export const PALACE_X: number[] = [1, 2, 3, 8, 9, 10];
export const PALACE_Y: number[] = [4, 5, 6];

export const linearDx = [1, -1, 0, 0];
export const linearDy = [0, 0, -1, 1];

export const diagDx = [1, 1, -1, -1];
export const diagDy = [1, -1, 1, -1];

export const CORNER_NUM = 4;
export const DIRECTION_NUM = 4;

export const palaceCornerPositions: Position[][] = [
  [PALACE.cho.bottomLeft, PALACE.han.topRight],
  [PALACE.cho.bottomRight, PALACE.han.topLeft],
  [PALACE.cho.topLeft, PALACE.han.bottomRight],
  [PALACE.cho.topRight, PALACE.han.bottomLeft],
];
