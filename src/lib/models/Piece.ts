import { Position } from '@models/Position';

import { CountryType, PieceType } from '@customTypes/janggiTypes';

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

  setPosition(newPosition: Position): void {
    this.position = newPosition;
  }

  isSamePiece(otherPiece: Piece): boolean {
    return (
      this.position.isSamePosition(otherPiece.position) &&
      this.country === otherPiece.country &&
      this.type === otherPiece.type
    );
  }

  isOpponent(otherPiece: Piece): boolean {
    return this.country !== otherPiece.country;
  }
}
