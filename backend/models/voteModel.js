const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voteID: String,
  voteName: String,
  voteDescription: String,
  eligibleVoterList: [String], // Array of voter IDs
  zkAppAddress: String,
  offchainCID: String,
  startTimestamp: Number,
  endTimestamp: Number,
});

module.exports = mongoose.model('Vote', voteSchema);
