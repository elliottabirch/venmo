const fs = require('fs');
const pdf = require('pdf-parse');
const hl = require('highland');
const path = require('path');
const csvStringify = require('csv-stringify');

const fileNames = fs.readdirSync(path.join(__dirname, './_SOURCE'));

const columns = {
  invoice: 'Invoice',
  invoiceDate: 'Invoice Date',
  dueDate: 'Due Date',
  dbt: 'DBT',
  orderNumber: 'Order Number',
  amount: 'Amount',
  internalNumber: 'Their Number',
};
hl(fileNames)
  .drop(1)
  .flatMap((fileName) => {
    const dataBuffer = fs.readFileSync(path.join(__dirname, './_SOURCE', fileName));
    return hl(pdf(dataBuffer));
  })
  .doto((a) => {
    console.log(a);
  })
  .map(({ text }) => text)
  .split()
  .splitBy(' ')
  .drop(13)
  .reject(val => !val)
  .batch(7)
  .map(([invoice, invoiceDate, dueDate, dbt, orderNumber, amount, internalNumber]) => ({
    invoice,
    invoiceDate,
    dueDate,
    dbt,
    orderNumber,
    amount,
    internalNumber,
  }))
  .stopOnError(err => console.error(err))
  .pipe(csvStringify({ columns, header: true }))

  .pipe(fs.createWriteStream(path.join(__dirname, './_OUTPUT/test.csv')));
