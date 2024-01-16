const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const { uploadBuffer, uploadText, pinataUploadJson } = require('./utils');

const app = express();
const port = 3001; // You can choose any available port

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
