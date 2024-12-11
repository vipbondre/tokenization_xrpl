const { createTrustLine, issueToken } = require("./xrplUtils");

async function simulateBankTransaction(product, price, holderAddress) {
  const currency = "USD";
  const limit = price * 2; // Example trust line limit

  // Step 1: Create trust line
  const trustLineResult = await createTrustLine(holderAddress, currency, limit);

  // Step 2: Issue token
  const tokenResult = await issueToken(holderAddress, currency, price);

  // Return token details
  const token = {
    currency,
    issuer: tokenResult.tx_json.Account,
    value: price,
  };

  return { token };
}

module.exports = { simulateBankTransaction };
