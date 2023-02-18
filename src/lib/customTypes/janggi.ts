import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

export enum CountryType {
  CHO = 'cho',
  HAN = 'han',
}

export enum PieceType {
  CANNON = 'cannon',
  CAR = 'car',
  ELEPHANT = 'elephant',
  HORSE = 'horse',
  KING = 'king',
  SCHOLAR = 'scholar',
  SOLDIER = 'soldier',
}

export interface TileI {
  position: Position;
  piece: Piece | null;
}

export type Board = TileI[][];
