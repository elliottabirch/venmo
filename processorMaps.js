const venmo = require('./venmo.js')
const splitwise = require('./splitwise.js')
const splitwiseJoined = require('./splitwiseJoined.js')
const {FILENAMES} =  require('./constants')

const streamMap = {
  [FILENAMES.VENMO]: venmo,
  [FILENAMES.SPLITWISE]: splitwise,
};

const joinedStreamMap = {
  [FILENAMES.SPLITWISE]: splitwiseJoined,
}

module.exports = {
  streamMap,
  joinedStreamMap,
}