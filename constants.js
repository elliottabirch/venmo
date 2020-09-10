
const os = require('os');

const SOURCE_ROOT_PATH = `${os.homedir()}/Downloads/`;

const venmoHeaders = [
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
  "terminal Location",
  'Year to Date Venmo Fees',
  'Disclaimer',
];

const splitWiseHeaders = [
  "date",
  "description",
  "Category",
  "cost",
  "Currency",
  "them",
  "me",
]

const ComputedVenmoHeaders = {
  PAYEE: 'payee',
}

const YNABVenmoColumnMap = {
  date: 'Date',
  [ComputedVenmoHeaders.PAYEE]: "Payee",
  note: "Memo",
  amount: "Amount" ,
};

const YNABSplitwiseColumnMap = {
  "date": "Date",
  "description": "Memo",
  "null": "Payee",
  "me": "Amount",
}

const quickenVenmoColumnMap = {
  id: 'Unique Trans. ID',
  date: 'Date',
  note: 'Memo',
  name: 'Name',
  amount: 'Amount',
  fee: 'fee',
  source: 'Account Type',
};

const FILENAMES = {
  VENMO: 1,
  1: 'VENMO',
  SPLITWISE: 2,
  2: 'SPLITWISE',
}

const fileNameMap = {
  [FILENAMES.VENMO]: /venmo_statement/,
  [FILENAMES.SPLITWISE]: /elissaggoldner/,
};

const YNABColumnMap = {
  [FILENAMES.VENMO]: YNABVenmoColumnMap,
  [FILENAMES.SPLITWISE]: YNABSplitwiseColumnMap,
}
const QuickenColumnMap = {
  [FILENAMES.VENMO]: quickenVenmoColumnMap,
}

module.exports = {
  FILENAMES,
  fileNameMap,
  venmoHeaders,
  YNABColumnMap,
  QuickenColumnMap,
  SOURCE_ROOT_PATH,
  ComputedVenmoHeaders,
  splitWiseHeaders,
};
