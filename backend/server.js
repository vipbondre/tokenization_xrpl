const express = require("express");
const bodyParser = require("body-parser");
const { createWallet } = require("./xrplUtils");
const { simulateBankTransaction } = require("./bankAPI");
const { verifyVendorTransaction } = require("./vendorAPI");

const app = express();
app.use(bodyParser.json());

app.get("/create-wallet", async (req, res) => {
  try {
    const wallet = await createWallet();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/bank", async (req, res) => {
  const { product, price, holderAddress } = req.body;
  try {
    const result = await simulateBankTransaction(product, price, holderAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/vendor", async (req, res) => {
  const { token } = req.body;
  try {
    const result = await verifyVendorTransaction(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
