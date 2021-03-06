const hl = require('highland');
const csvParse = require('csv-parse');
const path = require('path');
const fs = require('fs');
const {splitWiseHeaders, SOURCE_ROOT_PATH} = require('./constants.js');

module.exports = (fileType, fileName) => {
    return hl(fs.createReadStream(path.join(SOURCE_ROOT_PATH, fileName))
        .pipe(csvParse({ relax_column_count: true, from: 3, columns: splitWiseHeaders, auto_parse: val => (!val ? undefined : val) }))).drop(3)
        .map(({  date,
                  description,
                  cost,
                  them,
                  me}) => {
            const _cost = +cost
            const _me = Math.abs(+me);
            const sharedCost = _me * 2;
            const difference = _cost - sharedCost;
            const splitCost = (_cost - Math.abs(difference)) * -1;
            return [
                {date, description , cost, them, me: splitCost},
                {date, description , cost, them, me: -splitCost},
            ]

        })
        .flatten()
        .collect()
        .stopOnError((err) => {
            console.log(err);
        })
        .map(rows => ({fileType, rows}))
};

