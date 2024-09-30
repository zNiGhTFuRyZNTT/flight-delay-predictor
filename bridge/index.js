const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const VPS_API_URL = process.env.VPS_API_URL || 'http://70.34.200.208:5000';

app.post('/predict', async (req, res) => {
  try {
    const response = await axios.post(`${VPS_API_URL}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling VPS API:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.listen(PORT, () => {
  console.log(`Bridge API is running on port ${PORT}`);
});