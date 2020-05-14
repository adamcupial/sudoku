"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const cell_1 = require("./cell");
class Board {
    constructor(cells = []) {
        this.cells = new Map();
        this.possibleCellValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.backup = null;
        for (const cell of cells) {
            this.addCell(cell);
        }
    }
    addCell(cell) {
        const name = cell.toString();
        if (this.cells.has(name)) {
            throw new Error(`${name} already present on board`);
        }
        if (this.cells.size === 81) {
            throw new Error('Board at capacity');
        }
        this.cells.set(name, cell);
    }
    static fromArray(arr) {
        const cells = [];
        if (Array.isArray(arr)) {
            arr.forEach((row, rowIndex) => {
                row.forEach((value, columnIndex) => {
                    const val = (Number(value) === 0) ? null : Number(value);
                    cells.push(new cell_1.Cell(rowIndex + 1, columnIndex + 1, val));
                });
            });
            return new Board(cells);
        }
        else {
            throw new Error('expects array');
        }
    }
    *getUnsolved() {
        for (const [key, cell] of this.cells.entries()) {
            if (!cell.value) {
                yield cell;
            }
        }
    }
    updateCell(cell) {
        this.cells.set(cell.toString(), cell);
    }
    getPossibleValuesForCell(cell) {
        const rowMissing = this.getMissingValuesForRow(cell.row);
        const colMissing = this.getMissingValuesForColumn(cell.column);
        const squareMissing = this.getMissingValuesForSquare(cell.square);
        return [...this.possibleCellValues]
            .filter(val => rowMissing.indexOf(val) !== -1)
            .filter(val => colMissing.indexOf(val) !== -1)
            .filter(val => squareMissing.indexOf(val) !== -1);
    }
    getMissingValuesForPiece(num, piece) {
        const values = new Set();
        for (const cell of this.cells.values()) {
            if (cell.value && cell[piece] === num) {
                values.add(cell.value);
            }
        }
        return [...this.possibleCellValues].filter(x => !values.has(x));
    }
    getMissingValuesForSquare(squareNumber) {
        return this.getMissingValuesForPiece(squareNumber, 'square');
    }
    getMissingValuesForRow(rowNumber) {
        return this.getMissingValuesForPiece(rowNumber, 'row');
    }
    getMissingValuesForColumn(columnNumber) {
        return this.getMissingValuesForPiece(columnNumber, 'column');
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
                    easySolves += 1;
                }
                else if (solutions.length === 0) {
                    if (this.backup) {
                        this.cells = new Map(this.backup);
                        this.backup = null;
                        break;
                    }
                    else {
                        throw new Error(`Something went very wrong ${cell.toString()}`);
                    }
                }
            }
        } while (easySolves > 0);
        for (const cell of this.getUnsolved()) {
            if (this.backup === null) {
                this.backup = new Map();
                for (const [key, cell] of this.cells.entries()) {
                    this.backup.set(key, new cell_1.Cell(cell.row, cell.column, cell.value));
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
exports.Board = Board;
//# sourceMappingURL=board.js.map