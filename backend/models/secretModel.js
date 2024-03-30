const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  zkAppAddress: String,
  secretKey: String,
});

module.exports = mongoose.model('Secret', secretSchema);
