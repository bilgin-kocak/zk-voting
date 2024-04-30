const VotingAnalytics = require('../../models/VoteAnalyticsModel');

exports.getVoterTurnout = async (req, res) => {
  try {
    const voterTurnout = await VotingAnalytics.aggregate([
      { $group: { _id: '$date', totalVotes: { $sum: '$votes' } } },
      { $sort: { _id: 1 } }, // Sorting by date ascending
    ]);
    res.json(voterTurnout);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getDemographicInfo = async (req, res) => {
  try {
    const demographicData = await VotingAnalytics.aggregate([
      { $group: { _id: '$demographicInfo.region', count: { $sum: 1 } } },
    ]);
    res.json(demographicData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createVotingAnalytics = async (req, res) => {
  const { date, votes, demographicInfo } = req.body;
  try {
    const newVoting = new VotingAnalytics({
      date: new Date(date),
      votes,
      demographicInfo,
    });
    await newVoting.save();
    res.status(201).json(newVoting);
  } catch (error) {
    res.status(400).send(error);
  }
};
