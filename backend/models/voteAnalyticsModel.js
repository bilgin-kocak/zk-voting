const mongoose = require('mongoose');

const voteAnalyticsSchema = new mongoose.Schema({
  date: Date,
  voteCount: Number,
  demographicInfo: {
    ageGroup: String,
    region: String,
  },
});

module.exports = mongoose.model('VotingAnalytics', voteAnalyticsSchema);
