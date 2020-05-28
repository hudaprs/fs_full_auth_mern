const mongoose = require("mongoose");

const verificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "userVerification"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("verification", verificationSchema);
