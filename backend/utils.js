const lighthouse = require('@lighthouse-web3/sdk');
require('dotenv').config();

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

module.exports = {
  uploadBuffer,
  uploadFile,
  uploadText,
};
