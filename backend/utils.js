const lighthouse = require('@lighthouse-web3/sdk');
// Use the api keys by specifying your api key and api secret
const pinataSDK = require('@pinata/sdk');
require('dotenv').config();

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

const uploadBuffer = async (file) => {
  const res = await lighthouse.uploadBuffer(
    file,
    process.env.LIGHTHOUSE_API_KEY
  );
  return res.data;
};

const uploadFile = async (filePath) => {
  const res = await lighthouse.upload(filePath, process.env.LIGHTHOUSE_API_KEY);
  return res.data;
};

const uploadText = async (text) => {
  const res = await lighthouse.uploadText(text, process.env.LIGHTHOUSE_API_KEY);
  return res.data;
};

const pinataUploadJson = async (json) => {
  const res = await pinata.pinJSONToIPFS(json);
  console.log(res);
  return res;
};

module.exports = {
  uploadBuffer,
  uploadFile,
  uploadText,
  pinataUploadJson,
};
