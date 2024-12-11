const xrpl = require("xrpl");

let issuerWallet = xrpl.Wallet.generate(); // Simulate an issuer wallet

async function createTrustLine(holderSeed, currency, limit) {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net/");
  await client.connect();

  const holderWallet = xrpl.Wallet.fromSeed(holderSeed);

  const trustSetTx = {
    TransactionType: "TrustSet",
    Account: holderWallet.classicAddress,
    LimitAmount: {
      currency: currency,
      issuer: issuerWallet.classicAddress,
      value: limit.toString(),
    },
  };

  const prepared = await client.autofill(trustSetTx);
  const signed = holderWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  await client.disconnect();
  return result.resultCode;
}

async function issueToken(holderAddress, currency, amount) {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net/");
  await client.connect();

  const paymentTx = {
    TransactionType: "Payment",
    Account: issuerWallet.classicAddress,
    Destination: holderAddress,
    Amount: {
      currency: currency,
      issuer: issuerWallet.classicAddress,
      value: amount.toString(),
    },
  };

  const prepared = await client.autofill(paymentTx);
  const signed = issuerWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  await client.disconnect();
  return result.resultCode;
}

async function validateToken(holderAddress, currency) {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net/");
  await client.connect();

  const accountLines = await client.request({
    command: "account_lines",
    account: holderAddress,
  });

  await client.disconnect();
  return accountLines.result.lines.find(
    (line) => line.currency === currency && line.account === issuerWallet.classicAddress
  );
}

module.exports = { createTrustLine, issueToken, validateToken, issuerWallet };
