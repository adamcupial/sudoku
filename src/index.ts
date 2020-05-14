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
    console.log(parsed);
    const board = Board.fromArray(parsed);
    console.log(board);
  })
  .catch((err) => {
    console.error(err);
  });
