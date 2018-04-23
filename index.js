const hl = require('highland');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const path = require('path');
const fs = require('fs');

const fileNames = fs.readdirSync(path.join(__dirname, '_SOURCE'));
const headers = [
  'id',
  'date',
  'type',
  'status',
  'note',
  'from',
  'to',
  'amount',
  'fee',
  'souce',
  'destination',
];

let index = 0;

hl(fileNames)
  .flatMap(fileName => hl(fs.createReadStream(path.join(__dirname, `_OUTPUT/${fileName}-${index++}`))
    .pipe(csvParse({ columns: headers, auto_parse: val => (!val ? undefined : val) })))
    .drop(1));

