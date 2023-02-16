export class Position {
  r: number;
  c: number;

  constructor(r: number, c: number) {
    this.r = r;
    this.c = c;
  }

  isSamePosition(otherPosition: Position) {
    return this.r === otherPosition.r && this.c === otherPosition.c;
  }
}
