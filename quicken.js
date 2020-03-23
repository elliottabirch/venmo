const hl = require('highland');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const path = require('path');
const fs = require('fs');
const fileNames = fs.readdirSync('~/Downloads');

const {FILENAMES, fileNameMap, streamMap} = require('./constants.js');


hl(fileNames)
  .filter(name =>  name.test(fileNameMap[FILENAMES.VENMO]) ||
    name.test(fileNameMap[FILENAMES.SPLITWISE])
      .doto((a) => {
        console.log('processing ' + a);
      })
      .flatMap((fileName) => {
        if (fileName.test(fileNameMap[FILENAMES.VENMO])) {
          return venmo(fileName)
        }
        if (fileName.test(fileNameMap[FILENAMES.SPLITWISE])) {
          return splitwise(fileName)
        }
      })
      .each(({fileName, rows}) => {
        hl(rows).pipe(csvStringify({ columns, header: true }))
          .pipe(fs.createWriteStream(path.join(__dirname, `_OUTPUT/transactions-${index}.csv`)));
      });

