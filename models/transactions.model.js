const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
  blockNumber: {
    index: true,
    type: Number,
    required: [true, 'Block Number is required!']
  },
  timeStamp: {
    type: Number,
    required: true
  },
  hash: {
    type: String,
    index: true,
    unique: true,
    required: [true, 'Hash Field is required!']
  },
  nonce: {
    type: String,
  },
  blockHash: {
    index: true,
    type: String,
    required: [true, 'BlockHash is required!']
  },
  transactionIndex: {
    type: Number,
    required: [true, 'Transaction Index is required!']
  },
  from: {
    index: true,
    type: String,
    required: [true, 'From Field is required!']
  },
  to: {
    index: true,
    type: String,
    required: [true, 'To Field is required!']
  },
  value: {
    type: String,
    required: [true, 'Value Field is required!']
  },
  gas: {
    type: String
  },
  gasPrice: {
    type: String
  },
  isError: {
    type: Number
  },
  txreceipt_status: {
    type: Number
  },
  input: {
    type: String
  },
  contractAddress: {
    default: null,
    type: String
  },
  contractValue: {
    default: null,
    type: String
  },
  cumulativeGasUsed: {
    type: Number
  },
  gasUsed: {
    type: Number
  },
  confirmations: {
    type: Number
  },
  methodId: {
    type: String
  },
  functionName: {
    type: String
  }
}, { timestamps: true });

const Transactions = mongoose.model("Transactions", transactionsSchema);

module.exports = Transactions;
