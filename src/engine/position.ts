export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  floor() {
    return [Math.floor(this.x), Math.floor(this.y)];
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  multiply(value: number) {
    return new Position(this.x * value, this.y * value);
  }

  add(pos: Position) {
    return new Position(this.x + pos.x, this.y + pos.y);
  }

  substract(pos: Position) {
    return new Position(this.x - pos.x, this.y - pos.y);
  }

  static toAngle(angle: number, length: number) {
    return new Position(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  clone() {
    return new Position(this.x, this.y);
  }
}
