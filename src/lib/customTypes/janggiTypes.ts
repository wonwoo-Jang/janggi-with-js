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

export type Board = { position: Position; piece: Piece | null }[][];
