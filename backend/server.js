const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const xrplUtils = require("./xrpl-utils");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API to establish trust line
app.post("/trustline", async (req, res) => {
  const { holderSeed, currency, limit } = req.body;
  try {
    const result = await xrplUtils.createTrustLine(holderSeed, currency, limit);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to issue tokens
app.post("/issue", async (req, res) => {
  const { holderAddress, currency, amount } = req.body;
  try {
    const result = await xrplUtils.issueToken(holderAddress, currency, amount);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to validate tokens
app.get("/validate/:holderAddress/:currency", async (req, res) => {
  const { holderAddress, currency } = req.params;
  try {
    const tokenData = await xrplUtils.validateToken(holderAddress, currency);
    res.status(200).json({ tokenData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
