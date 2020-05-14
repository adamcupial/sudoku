import { promises as fsPromises } from 'fs';
import parse from 'csv-parse';
import { Board } from './lib/board';

fsPromises.readFile('example.csv')
  .then((contents) => {
    return new Promise((resolve, reject) => {
      parse(contents, {
        delimiter: ';',
      },(err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    });
  })
  .then((parsed) => {
    const board = Board.fromArray(parsed);
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
