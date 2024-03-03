const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const { uploadBuffer, uploadText, pinataUploadJson } = require('./utils');
const mongoose = require('mongoose');
const Vote = require('./models/voteModel');

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

app.get('/vote/:voteId', async (req, res) => {
  try {
    const vote = await Vote.findOne({ voteId: req.params.voteId });
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
      zkAppAdress: req.body.zkAppAdress,
      offchainCID: req.body.offchainCID,
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

app.get('/votes', async (req, res) => {
  try {
    const votes = await Vote.find({});
    res.status(200).send(votes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
