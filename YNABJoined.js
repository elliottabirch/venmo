const hl = require('highland');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const path = require('path');
const fs = require('fs');

const {FILENAMES, fileNameMap, YNABColumnMap, SOURCE_ROOT_PATH} = require('./constants.js');
const {joinedStreamMap} = require('./processorMaps')

const fileNames = fs.readdirSync(SOURCE_ROOT_PATH);
let index = 0;

hl(fileNames)
    .filter(name =>  fileNameMap[FILENAMES.SPLITWISE].test(name)
    )
    .doto((a) => {
        console.log('processing ' + a);
    })
    .map((fileName) => {
            return [FILENAMES.SPLITWISE, fileName]
    })
    .flatMap(([fileType, fileName]) => {
        return joinedStreamMap[fileType](fileType, fileName);
    })
    .doto(() => index++)
    .each(({fileType, rows}) => {
        const columns = YNABColumnMap[fileType];
        hl(rows).pipe(csvStringify({ columns, header: true }))
            .pipe(fs.createWriteStream(path.join(__dirname, `_OUTPUT/joined-${FILENAMES[fileType]}-transactions-${index}1.csv`)));
    });

