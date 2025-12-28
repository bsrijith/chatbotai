const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userEmail: String,
  message: String,
  reply: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
