const express = require("express");
const bodyParser = require("body-parser");
const { validateWallet, setInitialFlags, issueToken, displayWalletsAndBalances, transferTokensWrap } = require("./xrpl-utils");
const { simulateBankTransaction } = require("./bankAPI");
const { verifyVendorTransaction } = require("./vendorAPI");

const app = express();
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const currency = "SAW";

let orgUserWallet = null; // To store the user's wallet

app.post("/create-trustline", async (req, res) => {
  const { holderSeed } = req.body;
  try {
    const trustline = await validateWallet(holderSeed);
    res.status(200).json(trustline);
  } catch (error) {
    console.error("Error in /create-trustline:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-tokens", async (req, res) => {
  const { holderAddress, price } = req.body;
  try {
    //await setInitialFlags();
    const token = await issueToken(holderAddress, currency, price);
    await displayWalletsAndBalances(holderAddress, currency);
    res.status(200).json(token);
  } catch (error) {
    console.error("Error in /generate-tokens:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/transfer-tokens", async (req, res) => {
  const { holderSeed, price, product } = req.body;
  try {
    const token = await transferTokensWrap(holderSeed, price, product);
    res.status(200).json(token);
  } catch (error) {
    console.error("Error in /transfer-tokens:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------- End of Code in Action -------------------------------------------------------------------

app.post("/bank", async (req, res) => {
  const { product, price, holderAddress } = req.body;
  try {
    //let orgholderAddress = orgUserWallet.seed;
    //console.log("request to simulate bank: ", holderAddress);
    const result = await simulateBankTransaction(product, price, holderAddress);
    //console.log("result from simulate bank: ", result);
    res.status(200).json(result);
    //console.log("token result: ", res);
  } catch (error) {
    console.log("error from simulate bank: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/vendor", async (req, res) => {
  const { token } = req.body;
  try {
    const result = await verifyVendorTransaction(token);
    console.log("vendor validation: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.log("vendor validation error: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
