export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isSamePosition(otherPosition: Position): boolean {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }

  clone(): Position {
    return new Position(this.x, this.y);
  }
}
