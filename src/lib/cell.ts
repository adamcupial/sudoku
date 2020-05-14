export class Cell {
  row: number;
  column: number;
  value: number|null;
  square: number;

  constructor(row: number, column: number, value:null|number=null) {
    this.row = row;
    this.column = column;
    this.value = value;
    this.square = this.calculateSquare();
  }

  toString() {
    return `c${this.column}r${this.row}`;
  }

  private calculateSquare(): number {
    const c1 = [1, 2, 3];
    const c2 = [4, 5, 6];
    const c3 = [7, 8, 9];
    const r1 = [1, 2, 3];
    const r2 = [4, 5, 6];
    const r3 = [7, 8, 9];

    if (r1.indexOf(this.row) !== -1) {
      if (c1.indexOf(this.column) !== -1) {
        return 1;
      } else if (c2.indexOf(this.column) !== -1) {
        return 2;
      } else {
        return 3;
      }
    } else if (r2.indexOf(this.row) !== -1) {
      if (c1.indexOf(this.column) !== -1) {
        return 4;
      } else if (c2.indexOf(this.column) !== -1) {
        return 5;
      } else {
        return 6;
      }
    } else {
      if (c1.indexOf(this.column) !== -1) {
        return 7;
      } else if (c2.indexOf(this.column) !== -1) {
        return 8;
      } else {
        return 9;
      }
    }
  }

}
