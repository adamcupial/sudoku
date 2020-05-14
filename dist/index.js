"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const csv_parse_1 = __importDefault(require("csv-parse"));
const board_1 = require("./lib/board");
fs_1.promises.readFile('example.csv')
    .then((contents) => {
    return new Promise((resolve, reject) => {
        csv_parse_1.default(contents, {
            delimiter: ';',
        }, (err, output) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(output);
            }
        });
    });
})
    .then((parsed) => {
    const board = board_1.Board.fromArray(parsed);
    const solved = board.solve();
    let res = '';
    for (const cell of solved.values()) {
        res += ` ${cell.value ? cell.value : '_'} `;
        if (cell.column === 9) {
            res += '\n';
        }
    }
    console.log(res);
})
    .catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map