const hl = require('highland');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const path = require('path');
const fs = require('fs');

const fileNames = fs.readdirSync(path.join(__dirname, '_SOURCE'));
const columns = {
  id: 'Unique Trans. ID',
  date: 'Date',
  note: 'Memo',
  name: 'Name',
  amount: 'Amount',
  fee: 'fee',
  source: 'Account Type',
};


const headers = [
  'username',
  'id',
  'date',
  'Type',
  'Status',
  'note',
  'from',
  'to',
  'amount',
  'fee',
  'source',
  'dest',
  'beg balance',
  'Ending Balance',
  'Statement Period Venmo Fees',
  'Year to Date Venmo Fees',
  'Disclaimer',
];

const index = 0;

hl(fileNames)
  .doto((a) => {
    console.log(__dirname, `_SOURCE/${a}`);
  })
  .filter(name => name !== '.DS_Store')
  .flatMap(fileName => hl(fs.createReadStream(path.join(__dirname, `_SOURCE/${fileName}`))
    .pipe(csvParse({ columns: headers, auto_parse: val => (!val ? undefined : val) }))).drop(1))
// .filter(({ amount }) => +amount < 0)
  .map(({ from, to, ...rest }) => ({ name: `${from}->${to}`, ...rest }))
  .collect()
  .stopOnError((err) => {
    console.log(err);
  })
  // .doto(a => index++)
  .each((rows) => {
    hl(rows).pipe(csvStringify({ columns, header: true }))
      .pipe(fs.createWriteStream(path.join(__dirname, `_OUTPUT/transactions-${index}.csv`)));
  });

