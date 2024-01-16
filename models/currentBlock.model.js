const mongoose = require("mongoose");

const currentBlockSchema = new mongoose.Schema({
  blockNumber: {
    unique: true,
    type: Number,
    required: [true, 'Block Number is required!']
  },
}, { timestamps: true });

const CurrentBlock = mongoose.model("CurrentBlock", currentBlockSchema);

module.exports = CurrentBlock;
