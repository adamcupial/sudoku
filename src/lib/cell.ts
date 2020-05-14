export class Cell {
  row: number;
  column: number;
  value: number|null;

  constructor(row: number, column: number, value:null|number=null) {
    this.row = row;
    this.column = column;
    this.value = value;
  }

  toString() {
    return `c${this.column}r${this.row}`;
  }

  get square() {
    return 1;
  }
}
