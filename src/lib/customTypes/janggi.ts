export interface Position {
  r: number;
  c: number;
}

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

export interface Piece {
  type: PieceType;
  position: Position;
  country: CountryType;
  image?: string; // will be changed to required field later
}
