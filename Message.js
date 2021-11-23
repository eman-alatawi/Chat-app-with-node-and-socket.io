const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  from: String,
  to: String,
  createdAt: Date
});

module.exports = mongoose.model('Message', messageSchema);