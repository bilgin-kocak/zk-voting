const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const { uploadBuffer, uploadText, pinataUploadJson } = require('./utils');
const mongoose = require('mongoose');
const Vote = require('./models/voteModel');
const Secret = require('./models/secretModel');
const User = require('./models/userModel');
const Notification = require('./models/notificationModel');
const votingAnalyticsController = require('../controllers/voting-analytics');
const { check, validationResult } = require('express-validator');
const { voteFHE, decryptVoteResult } = require('./encryption');
const app = express();
const port = process.env.PORT || 3001; // You can choose any available port

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) =>
    console.error('Could not connect to MongoDB Atlas:', error)
  );

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/offchain/:cid', async (req, res) => {
  try {
    // const url = `https://gateway.lighthouse.storage/ipfs/${req.params.cid}`;
    const url = `https://moccasin-weary-cat-358.mypinata.cloud/ipfs/${req.params.cid}`;

    // Forward the GET request
    const response = await axios.get(url);

    // Send back the response from the target server
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error forwarding GET request:', error);
    res.status(500).send('Error forwarding request');
  }
});

// POST endpoint
app.post('/offchain', async (req, res) => {
  try {
    // Extract data from the incoming request
    const data = req.body;

    // // Your object
    // const data = {
    //   voters: [
    //     '4858060760719592737905497813249980962237688763740004316685311851052356036041',
    //     '4858060760719592737905497813249980962237688763740004316685311851052356036041',
    //     '4858060760719592737905497813249980962237688763740004316685311851052356036041',
    //     '4858060760719592737905497813249980962237688763740004316685311851052356036041',
    //   ],
    //   voterCounts: [0, 0],
    //   nullifiers: [],
    // };

    // // Convert the object to a JSON string
    // const data = JSON.stringify(obj);

    const result = await pinataUploadJson(data);

    const dataString = JSON.stringify(data);
    // Convert the JSON string to a Buffer
    const dataBuffer = Buffer.from(dataString);

    // const result = await uploadBuffer(dataBuffer);
    console.log(result);
    // Send back the response from the target server
    res.status(201).send('success');
  } catch (error) {
    console.error('Error forwarding POST request:', error);
    res.status(500).send('Error forwarding request');
  }
});

app.get('/vote/:zkAppAddress', async (req, res) => {
  try {
    const vote = await Vote.findOne({ zkAppAddress: req.params.zkAppAddress });
    if (!vote) {
      return res.status(404).send('Vote not found');
    }
    res.status(200).send(vote);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/vote/create', async (req, res) => {
  try {
    // Save data to mongodb
    const vote = new Vote({
      voteID: req.body.voteId,
      voteName: req.body.voteName,
      voteDescription: req.body.voteDescription,
      eligibleVoterList: req.body.eligibleVoterList,
      zkAppAddress: req.body.zkAppAddress,
      offchainCID: req.body.offchainCID,
      startTimestamp: req.body.startTimestamp,
      endTimestamp: req.body.endTimestamp,
    });

    const savedVote = await vote.save();
    // res.status(201).send(savedVote);

    // Send back the response from the target server
    res.status(201).send('success');
  } catch (error) {
    console.error('Error forwarding POST request:', error);
    res.status(500).send('Error forwarding request');
  }
});

// Route to update the eligibleVoterList for a vote
app.put('/votes/:voteId/addVoters', async (req, res) => {
  const { voteId } = req.params;
  const { votersToAdd } = req.body; // Expect an array of voter IDs

  // Validate the request
  if (!voteId || !votersToAdd || !Array.isArray(votersToAdd)) {
    return res.status(400).send('Invalid request');
  }

  try {
    // Update the document using $addToSet to ensure unique additions
    const updatedVote = await Vote.findOneAndUpdate(
      { voteId },
      { $addToSet: { eligibleVoterList: { $each: votersToAdd } } },
      { new: true } // Returns the updated document
    );

    if (!updatedVote) {
      return res.status(404).send('Vote not found');
    }

    res.status(200).send(updatedVote);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// This route will return all votes that are currently active
app.get('/votes', async (req, res) => {
  try {
    const now = Date.now();
    const votes = await Vote.find({
      startTimestamp: { $lte: now },
      endTimestamp: { $gte: now },
    });
    res.status(200).send(votes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// This route will return all votes that are past
app.get('/past-votes', async (req, res) => {
  try {
    const now = Date.now();
    const votes = await Vote.find({
      startTimestamp: { $gte: now },
    });
    res.status(200).send(votes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// This route will return all votes that are future
app.get('/future-votes', async (req, res) => {
  try {
    const now = Date.now();
    const votes = await Vote.find({
      endTimestamp: { $lte: now },
    });
    res.status(200).send(votes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get related votes by zkAppAddress
// This won't return one vote, but all votes related to the zkAppAddress
app.get('/votes/:zkAppAddress', async (req, res) => {
  // Validate the request
  if (!req.params.zkAppAddress) {
    return res.status(400).send('Invalid request');
  }
  try {
    // Get all votes related to the zkAppAddress
    const votes = await Vote.find({
      eligibleVoterList: { $elemMatch: { $eq: req.params.zkAppAddress } },
    });
    res.status(200).send(votes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Vote encytpted
app.get('/fhe-vote', async (req, res) => {
  try {
    const voteResult = req.body.voteResult;
    const newVote = req.body.newVote;
    const zkAppAddress = req.body.zkAppAddress;

    // Validate the request
    if (!voteResult || !newVote || !zkAppAddress) {
      return res.status(400).send('Invalid request');
    }

    // If the vote is not found, return 404
    const vote = await Vote.findOne({ zkAppAddress: zkAppAddress });
    if (!vote) {
      return res.status(404).send('Vote not found');
    }

    // If the vote is not active, return 400
    const now = Date.now();
    if (vote.startTimestamp > now || vote.endTimestamp < now) {
      return res.status(400).send('Vote is not active');
    }

    // Get previous vote result
    const previousVoteResult = vote.voteResult;
    if (!previousVoteResult) {
      return res.status(400).send('Vote result not found');
    }

    // Decrypt previous vote result
    const secret = await Secret.findOne({ zkAppAddress: zkAppAddress });
    if (!secret) {
      return res.status(404).send('Secret not found');
    }

    const oldSecretKey = secret.secretKey;
    const oldResult = await decryptVoteResult(oldSecretKey, previousVoteResult);

    // Encrypt vote result
    const result = await voteFHE(oldResult, newVote);

    // save secret key to db
    const secretKey = result.secretKey;
    const newSecret = new Secret({
      zkAppAddress: zkAppAddress,
      secretKey: secretKey,
    });

    // Save the secret key to the database
    newSecret.save();

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/decrypt-vote-result', async (req, res) => {
  try {
    const voteResultCipherText = req.body.voteResultCipherText;
    const zkAppAddress = req.body.zkAppAddress;

    // Validate the request
    if (!voteResultCipherText || !zkAppAddress) {
      return res.status(400).send('Invalid request');
    }

    const secret = await Secret.findOne({ zkAppAddress: zkAppAddress });
    if (!secret) {
      return res.status(404).send('Secret not found');
    }

    const secretKey = secret.secretKey;
    const result = await decryptVoteResult(secretKey, voteResultCipherText);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    // const votings = await Voting.find({ createdBy: userId });
    const notifications = await Notification.find({ user: userId });

    res.json({ user, votings, notifications });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.get('/analytics/turnout', votingAnalyticsController.getVoterTurnout);
router.get(
  '/analytics/demographics',
  votingAnalyticsController.getDemographicInfo
);
router.post(
  '/analytics',
  [
    check('date')
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date string'),
    check('votes').isNumeric().withMessage('Votes must be a numeric value'),
    check('demographicInfo.ageGroup')
      .isString()
      .withMessage('Age group must be a string'),
    check('demographicInfo.region')
      .isString()
      .withMessage('Region must be a string'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    votingController.createVoting(req, res);
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
