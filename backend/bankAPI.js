const xrpl = require("xrpl");

const { createTrustLine, issueToken, displayWalletsAndBalances, transferTokens, setInitialFlags } = require("./xrpl-utils");

const issuerWallet = xrpl.Wallet.fromSeed("sEdTyquFDyZLvKQqxP3wtBf4csixYie");  //xrpl.Wallet.generate();
const userWallet = xrpl.Wallet.fromSeed("sEdS1LZeEpUECZ9zLw5bWTYUd2NpwXg");
const vendorWallet = xrpl.Wallet.fromSeed("sEdTsKFP712zRRg3KxNY3iz6PPvCCDV");

async function simulateBankTransaction(product, price, holderAddress) {
  const currency = "SAW";
  const limit = price * 20; // Example trust line limit

  await setInitialFlags();
  // Step 1: Create trustline (issuer -> user)
  const trustLineUser = await createTrustLine(userWallet, issuerWallet.classicAddress, currency, limit);
  console.log("Trustline created for user:", trustLineUser);

  // Step 2: Create trustline (issuer -> vendor)
  const trustLineVendor = await createTrustLine(vendorWallet, issuerWallet.classicAddress, currency, limit);
  console.log("Trustline created for vendor:", trustLineVendor);

  // Step 3: Issue token to user
  const tokenResult = await issueToken(userWallet.classicAddress, currency, price);
  console.log("Issued token to user:", tokenResult);
  //const tokenResult1 = await issueToken(vendorWallet.classicAddress, currency, price);
  //console.log("Issued token to vendor:", tokenResult1);

  // Display balances after issuance
  await displayWalletsAndBalances(currency);

  // Step 4: Transfer token from user to vendor
  const transferResult = await transferTokens(userWallet, vendorWallet.classicAddress, price, currency);
  console.log("Vendor received token:", transferResult);
  /*
  await displayWalletsAndBalances(currency);
  const transferResult1 = await transferTokens(userWallet, issuerWallet.classicAddress, price, currency);
  console.log("Vendor received token:", transferResult1);
  await displayWalletsAndBalances(currency);
  const transferResult2 = await transferTokens(vendorWallet, issuerWallet.classicAddress, price, currency);
  console.log("Vendor received token:", transferResult2);
  await displayWalletsAndBalances(currency);
  const transferResult3 = await transferTokens(vendorWallet, userWallet.classicAddress, price, currency);
  console.log("Vendor received token:", transferResult3);
  */
  // Display final balances
  await displayWalletsAndBalances(currency);

    // Return token details
    const token = {
      currency,
      issuer: transferResult.result.tx_json.Account,
      value: price,
    };
  
  return { token };
  //return transferResult;
  //return { token: { currency, issuer: issuerWallet.classicAddress, value: price } };
}


module.exports = { simulateBankTransaction };
