const hl = require('highland');
const csvParse = require('csv-parse');
const path = require('path');
const fs = require('fs');
const {splitWiseHeaders, SOURCE_ROOT_PATH} = require('./constants.js');

module.exports = (fileType, fileName) => {
 return hl(fs.createReadStream(path.join(SOURCE_ROOT_PATH, fileName))
  .pipe(csvParse({ relax_column_count: true, from: 3, columns: splitWiseHeaders, auto_parse: val => (!val ? undefined : val) }))).drop(2)
  .collect()
  .stopOnError((err) => {
    console.log(err);
  })
  .map(rows => ({fileType, rows}))
};

