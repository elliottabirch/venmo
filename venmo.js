const hl = require('highland');
const csvParse = require('csv-parse');
const path = require('path');
const fs = require('fs');
const {venmoHeaders, SOURCE_ROOT_PATH, ComputedVenmoHeaders} = require('./constants.js');

module.exports = (fileType, fileName) => {
 return hl(fs.createReadStream(path.join(SOURCE_ROOT_PATH, fileName))
  .pipe(csvParse({ columns: venmoHeaders, auto_parse: val => (!val ? undefined : val) }))).drop(2)
  .filter(({id}) => !!id)
  .map(({ from, to, amount, ...rest }) => {
    let me, them;
    if (/Elliott/.test(from)) {
      me = from;
      them = to;
    } else {
      me = to;
      them = from;
    }
    if (amount[0] === "+") {
      from = them;
      to = me;
    } else {
      from = me;
      to = them;
    }

    return { [ComputedVenmoHeaders.PAYEE]: `${from} -> ${to}`, ...rest, amount }
  })
  .collect()
  .stopOnError((err) => {
    console.log(err);
  })
  .map(rows => ({fileType, rows}))

};

