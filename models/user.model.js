const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    sparse: true,
    trim: true,
    default: '',
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  username: {
    type: String,
    index: true,
    required: [true, 'Username Field is required!']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    // select: false
  },
  isVerified: {
    type: Boolean,
    default: false,
    select: true
  },
  verifyToken: {
    type: String
  },
  resetOtp:{
    type:Number
  },
  resetOtpExpiresIn:{
    type:Date
  },
  tokenTime: {
    type: Date,
    default: Date.now,
    required: true
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
