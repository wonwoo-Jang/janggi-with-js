export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isSamePosition(otherPosition: Position) {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }
}
