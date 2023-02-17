import { Position } from '@models/Position';

import { CountryType, PieceType } from '@customTypes/janggi';

export class Piece {
  type: PieceType;
  country: CountryType;
  image: string;
  position: Position;
  possibleMoves: Position[];

  constructor(type: PieceType, position: Position, country: CountryType, image: string) {
    this.type = type;
    this.country = country;
    this.image = image;
    this.position = position;
    this.possibleMoves = [];
  }

  setPosition(newPosition: Position) {
    this.position = newPosition;
  }

  isSamePiece(otherPiece: Piece) {
    return (
      this.position.isSamePosition(otherPiece.position) &&
      this.country === otherPiece.country &&
      this.type === otherPiece.type
    );
  }

  isOpponent(otherPiece: Piece) {
    return this.country !== otherPiece.country;
  }
}
