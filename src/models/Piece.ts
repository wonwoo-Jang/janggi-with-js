import { CountryType, PieceType, Position } from '@customTypes/janggi';

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

  isOpponent(otherPiece: Piece) {
    return this.country !== otherPiece.country;
  }
}
