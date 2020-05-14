import { Cell } from './cell';

export class Board {
  cells: Map<string, Cell>;
  possibleCellValues: Set<number>;
  backup: Map<string, Cell>|null;

  constructor(cells:Cell[]=[]) {
    this.cells = new Map();
    this.possibleCellValues = new Set([1,2,3,4,5,6,7,8,9]);
    this.backup = null;

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
    const rowMissing = this.getMissingValuesForRow(cell.row);
    const colMissing = this.getMissingValuesForColumn(cell.column);
    const squareMissing = this.getMissingValuesForSquare(cell.square);

    return [...this.possibleCellValues]
      .filter(val => rowMissing.indexOf(val) !== -1)
      .filter(val => colMissing.indexOf(val) !== -1)
      .filter(val => squareMissing.indexOf(val) !== -1);
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

  solve(): Map<string, Cell> {
    let easySolves = 0;

    do {
      easySolves = 0;

      for (const cell of this.getUnsolved()) {
        const solutions = this.getPossibleValuesForCell(cell);

        if (solutions.length === 1) {
          cell.value = solutions[0];
          this.updateCell(cell);
          easySolves += 1;
        } else if (solutions.length === 0) {
          if (this.backup) {
            this.cells = new Map(this.backup);
            this.backup = null;
            break;
          } else {
            throw new Error(`Something went very wrong ${cell.toString()}`);
          }
        }
      }
    } while (easySolves > 0);

    for (const cell of this.getUnsolved()) {
      if (this.backup === null) {
        this.backup = new Map();
        for (const [key, cell] of this.cells.entries()) {
          this.backup.set(key, new Cell(cell.row, cell.column, cell.value));
        }
      }

      const solutions = this.getPossibleValuesForCell(cell);
      const chosen = solutions[Math.floor(Math.random() * solutions.length)];
      cell.value = chosen;
      this.updateCell(cell);
      return this.solve();
    }


    return this.cells;
  }
}
