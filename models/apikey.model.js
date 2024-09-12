const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  user_id: {
    index: true,
    type: String,
    required: [true, 'User ID is required!']
  },
  key_name: {
    type: String,
  },
  key: {
    type: String,
    required: [true, 'Key is required!']
  },
  key_time: {
    type: Date,
    default: Date.now,
    required: true
  },
}, { timestamps: true });

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

module.exports = ApiKey;
