const xrpl = require("xrpl");
const client = new xrpl.Client("wss://s.altnet.rippletest.net/");

const issuerWallet = xrpl.Wallet.generate();

async function createWallet() {
  return xrpl.Wallet.generate();
}

async function createTrustLine(holderSeed, currency, limit) {
  const holderWallet = xrpl.Wallet.fromSeed(holderSeed);
  await client.connect();

  const trustSet = {
    TransactionType: "TrustSet",
    Account: holderWallet.classicAddress,
    LimitAmount: {
      currency,
      issuer: issuerWallet.classicAddress,
      value: limit.toString(),
    },
  };

  const prepared = await client.autofill(trustSet);
  const signed = holderWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  await client.disconnect();

  return result;
}

async function issueToken(holderAddress, currency, amount) {
  await client.connect();

  const payment = {
    TransactionType: "Payment",
    Account: issuerWallet.classicAddress,
    Destination: holderAddress,
    Amount: {
      currency,
      issuer: issuerWallet.classicAddress,
      value: amount.toString(),
    },
  };

  const prepared = await client.autofill(payment);
  const signed = issuerWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  await client.disconnect();

  return result;
}

module.exports = { createWallet, createTrustLine, issueToken };
