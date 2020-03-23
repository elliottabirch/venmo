const venmo = require('./venmo.js')
const splitwise = require('./splitwise.js')
const {FILENAMES} =  require('./constants')

const streamMap = {
  [FILENAMES.VENMO]: venmo,
  [FILENAMES.SPLITWISE]: splitwise,
};

module.exports = {
  streamMap,
}