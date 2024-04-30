const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  zkCredentials: { type: String, required: true }, // Simplified for the example
});

module.exports = mongoose.model('User', UserSchema);
