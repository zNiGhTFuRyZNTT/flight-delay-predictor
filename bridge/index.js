const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// configure express
app.use(cors());
app.use(express.json());

const VPS_API_URL = process.env.VPS_API_URL || 'http://70.34.200.208:5000'; // use the url specified in .env or if null use default

// on post request to /predict do the above
app.post('/predict', async (req, res) => {
  try {
    const response = await axios.post(`${VPS_API_URL}/predict`, req.body); // take the request and forward it to the actual server
    res.json(response.data); // receive the response from the server and send it back to the client
  } catch (error) {
    console.error('Error calling VPS API:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.listen(PORT, () => {
  console.log(`Bridge API is running on port ${PORT}`);
});