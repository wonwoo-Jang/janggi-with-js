import { Position } from '@models/Position';

import { CountryType, PieceType } from '@customTypes/janggiTypes';

import { PIECE_POINT } from '@utils/janggi/constants';

export class Piece {
  type: PieceType;
  country: CountryType;
  point: number;
  image: string;
  position: Position;
  possibleMoves: Position[];
  blockedMoves: Position[]; // if you move to these positions, your king will be checked
  isCheck: boolean;

  constructor(type: PieceType, position: Position, country: CountryType, image: string) {
    this.type = type;
    this.country = country;
    this.point = PIECE_POINT[type];
    this.image = image;
    this.position = position;
    this.possibleMoves = [];
    this.blockedMoves = [];
    this.isCheck = false;
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

  isKing(): boolean {
    return this.type === PieceType.KING;
  }

  isSliding(): boolean {
    return [PieceType.CAR, PieceType.KING, PieceType.SCHOLAR, PieceType.SOLDIER].includes(this.type);
  }

  isJumping(): boolean {
    return [PieceType.CANNON, PieceType.ELEPHANT, PieceType.HORSE].includes(this.type);
  }

  clone(): Piece {
    return new Piece(this.type, this.position.clone(), this.country, this.image);
  }
}
