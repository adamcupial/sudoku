import { Cell } from './cell';

export class Board {
  cells: Map<string, Cell>;
  possibleCellValues: Set<number>;

  constructor(cells:Cell[]=[]) {
    this.cells = new Map();
    this.possibleCellValues = new Set([1,2,3,4,5,6,7,8,9]);

    for (const cell of cells) {
      this.addCell(cell);
    }
  }

  addCell(cell:Cell) {
    const name = cell.toString();
    if (this.cells.has(name)) {
      throw new Error(`${name} already present on board`);
    }

    if (this.cells.size === 81) {
      throw new Error('Board at capacity');
    }

    this.cells.set(name, cell);
  }

  static fromArray(arr: unknown): Board {
    const cells:Cell[]= [];

    if (Array.isArray(arr)) {
      arr.forEach((row: Array<string>, rowIndex: number) => {
        row.forEach((value: string, columnIndex: number) => {
          const val = (Number(value) === 0) ? null : Number(value);
          cells.push(new Cell(rowIndex + 1, columnIndex + 1, val));
        });
      });

      return new Board(cells);
    } else {
      throw new Error('expects array');
    }
  }

  * getUnsolved() {
    for(const [key, cell] of this.cells.entries()) {
      if (!cell.value) {
        yield cell;
      }
    }
  }

  updateCell(cell: Cell): void {
    this.cells.set(cell.toString(), cell);
  }

  getPossibleValuesForCell(cell: Cell): number[] {
    return [1];
  }

  private getMissingValuesForPiece(num: number, piece: 'row'|'column'|'square') {
  const values = new Set();
    for (const cell of this.cells.values()) {
      if (cell.value && cell[piece] === num) {
        values.add(cell.value);
      }
    }

    return [...this.possibleCellValues].filter(x => !values.has(x));
  }

  private getMissingValuesForSquare(squareNumber: number): number[] {
    return this.getMissingValuesForPiece(squareNumber, 'square');
  }

  private getMissingValuesForRow(rowNumber: number): number[] {
    return this.getMissingValuesForPiece(rowNumber, 'row');
  }

  private getMissingValuesForColumn(columnNumber: number): number[] {
    return this.getMissingValuesForPiece(columnNumber, 'column')
  }

  solve() {
    let easySolves = 0;
    do {
      easySolves = 0;

      for (const cell of this.getUnsolved()) {
        const solutions = this.getPossibleValuesForCell(cell);
        if (solutions.length === 1) {
          cell.value = solutions[0];
          this.updateCell(cell);
        } else if (solutions.length === 0) {
          throw new Error('Something went very wrong');
        }
      }
    } while (easySolves > 0);
  }
}
