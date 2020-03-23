const hl = require('highland');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const path = require('path');
const fs = require('fs');

const fileNames = fs.readdirSync(path.join(__dirname, '_SOURCE'));
const columns = {
  payee: 'description',
  date: 'date',
  memo: 'memo',
  account: 'account',
  transfer: 'transfer account',
  outflow: 'withdrawal',
  inflow: 'deposit',

};


const headers = [
  'date',
  'payee',
  'category',
  'transfer',
  'outflow',
  'inflow',
  'account',
  'memo',
  'blank'
];

hl(fileNames)
  .doto((a) => {
    console.log(__dirname, `_SOURCE/${a}`);
  })
  .filter(name => name !== '.DS_Store')
  .flatMap(fileName => hl(fs.createReadStream(path.join(__dirname, `_SOURCE/${fileName}`))
    .pipe(csvParse({ columns: headers, auto_parse: val => (!val ? undefined : val) }))).drop(1))
  .group('account')
  .flatMap((accounts) => hl.pairs(accounts))
  .stopOnError((err) => {
    console.log(err);
  })
  .each(([account, rows]) => {
    hl(rows).pipe(csvStringify({ columns, header: true }))
      .pipe(fs.createWriteStream(path.join(__dirname, `_OUTPUT/property-transfer-transactions-${account}.csv`)));
  });

