const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CORS Proxy is running');
});

// Proxy route: forwards request to the target API
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing target URL in query parameter ?url=' });
  }

  try {
    const response = await axios.get(targetUrl);
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from target URL', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CORS proxy running on port ${PORT}`);
});