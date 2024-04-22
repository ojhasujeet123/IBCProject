const mongoose = require("mongoose");

const holderSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Address field is required!'],
    unique: true,
  },
  tokenInfo: {
    name: {
      type: String,
      required: [true, 'Please provide a Name'],
      minlength: 3,
    },
    contractAddress: {
      type: String,
      default: false,
    },
  },
  balances: {
    tokenBalance: {
      type: Number,
      required: [true, 'Token balance is required!'],
    },
    etherBalance: {
      type: Number,
      required: [true, 'Ether balance is required!'],
    },
  },
}, { timestamps: true });

const Holder = mongoose.model("Holder", holderSchema);

module.exports = Holder;
