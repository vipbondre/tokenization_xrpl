const xrpl = require("xrpl");
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233/", { connectionTimeout: 500000 });

const currency = "SAW";
const limit = 1000000;

const issuerWalletAddress = "rHDqpezWqnbpWt359n9DAmrrHdeyaWHMUv";
const userWalletAddress = "rUTabntmg87TAKGeA5y3sxSeNT5r92CqzK";
const vendorWalletAddress = "rs2pbGtJWMq4FbYkXfM7ioyACzUdBYyiML";

const issuerWallet = xrpl.Wallet.fromSeed("sEdTyquFDyZLvKQqxP3wtBf4csixYie");  //xrpl.Wallet.generate();
const userWallet = xrpl.Wallet.fromSeed("sEdS1LZeEpUECZ9zLw5bWTYUd2NpwXg");
const vendorWallet = xrpl.Wallet.fromSeed("sEdTsKFP712zRRg3KxNY3iz6PPvCCDV");

async function generateWallet() {
  const wallet = xrpl.Wallet.generate();
  return wallet;
}

async function validateWallet(holderSeed) {
  let userWallet = xrpl.Wallet.fromSeed(holderSeed);
  await displayWalletsAndBalances(userWallet.classicAddress, currency); //xrpl.Wallet.generate();
  const trustline = await createTrustLine(userWallet, issuerWallet.classicAddress, currency, limit);
  return trustline;
}

async function getBalance(classicAddress) {
  await client.connect();
  const standby_balance = (await client.getXrpBalance(classicAddress));
  return standby_balance;
}

async function getIssuerBalance(classicAddress, currency) {
  const userBalances = await client.request({
    command: "account_lines",
    account: classicAddress
  });

  const trustLines = userBalances.result.lines.filter(
    (line) => line.currency === currency
  );

  const totalBalance = trustLines.reduce((sum, trustLine) => {
    return sum + parseInt(trustLine.balance, 10);  // Sum the balances as integers
  }, 0);

  if (trustLines) {
    //console.log(`Balance for ${currency}: ${trustLine.balance}`);
    //console.log(userBalances.result.lines);
    return totalBalance;
  } else {
    console.log(`No trustline found for ${currency} issued by ${classicAddress}.`);
    return null;
  }
  //return userBalances;
}

async function getTokenBalance(classicAddress, currency) {
  try {
    await client.connect();
    const response = await client.request({
      command: "account_lines",
      account: classicAddress,
    });

    // Filter for the specific token and issuer
    const trustLine = response.result.lines.find(
      (line) => line.currency === currency && line.account === issuerWallet.classicAddress);

    if (trustLine) {
      //console.log(`Balance for ${currency}: ${trustLine.balance}`);
      return trustLine.balance;
    } else {
      console.log(`No trustline found for ${currency} issued by ${issuerWalletAddress}.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
}

async function displayWalletsAndBalances(holderAddress, currency) {
  //const wallet = await generateWallet(); // Generate new wallet
  console.log("Issuer Wallet Address:", issuerWallet.classicAddress);
  let balance1 = await getBalance(issuerWallet.classicAddress);
  console.log(`Issuer Wallet Balance: ${balance1} XRP`);
  let balance2 = await getIssuerBalance(issuerWallet.classicAddress, currency);
  console.log("Issuer wallet balance in MYT:", balance2);

  console.log("User Wallet Address:", holderAddress);
  balance1 = await getBalance(holderAddress);
  console.log(`Usser Wallet Balance: ${balance1} XRP`);
  balance2 = await getTokenBalance(holderAddress, currency);
  console.log(`User Wallet Balance: ${balance2} ${currency}`);

  console.log("Vendor Wallet Address:", vendorWallet.classicAddress);
  balance1 = await getBalance(vendorWallet.classicAddress);
  console.log(`Vendor Wallet Balance: ${balance1} XRP`);
  balance2 = await getTokenBalance(vendorWallet.classicAddress, currency);
  console.log(`Vendor Wallet Balance: ${balance2} ${currency}`);

  // send xrp
  //const sendResult = await sendXRP(issuerWallet.seed, userWallet.classicAddress, amount);
  //console.log("XRP Sent:", sendResult);
}

async function createTrustLine(holderWallet, issuerAddress, currency, limit) {
  await client.connect();

  const trustSet = {
    TransactionType: "TrustSet",
    Account: holderWallet.classicAddress,
    LimitAmount: {
      currency,
      issuer: issuerAddress,
      value: limit.toString(),
    },
  };

  const prepared = await client.autofill(trustSet);
  const signed = holderWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  const trustlines = await client.request({
    command: "account_lines",
    account: holderWallet.classicAddress,
  });
  console.log("trustlines: ", trustlines.result.lines);
  console.log("trustline: ", result);
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
  console.log(result);
  return result;
}

async function sendXRP(senderSeed, receiverAddress, amountXRP) {
  try {
    await client.connect();

    // Generate wallet from sender's seed
    const senderWallet = xrpl.Wallet.fromSeed(senderSeed);

    // Prepare the payment transaction
    const payment = {
      TransactionType: "Payment",
      Account: senderWallet.classicAddress,
      Destination: receiverAddress,
      Amount: xrpl.xrpToDrops(amountXRP), // Convert XRP to drops (1 XRP = 1,000,000 drops)
    };

    // Autofill, sign, and submit the transaction
    const prepared = await client.autofill(payment);
    const signed = senderWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    console.log(`Transaction successful! Result: ${result.result.meta.TransactionResult}`);
    console.log(`Transaction Hash: ${result.result.tx_json.hash}`);
    return result;
  } catch (error) {
    console.error(`Error sending XRP: ${error.message}`);
  } finally {
    await client.disconnect();
  }
}

async function transferTokensWrap(holderSeed, price, product) {

  const trustLineVendor = await createTrustLine(vendorWallet, issuerWallet.classicAddress, currency, limit);

  const holderWallet = xrpl.Wallet.fromSeed(holderSeed);
  const token = await transferTokens(holderWallet, vendorWallet.classicAddress, price, currency);
  //const validation = await vendorValidation();

  await displayWalletsAndBalances(holderWallet.classicAddress, currency);

  return token;
}

async function transferTokens(holderWallet, vendorAddress, amount, currency) {
  try {
    await client.connect();

    // Verify payment path
    const pathCheck = await client.request({
      command: "ripple_path_find",
      source_account: holderWallet.classicAddress,
      destination_account: vendorAddress,
      destination_amount: {
        currency,
        issuer: issuerWallet.classicAddress,
        value: amount.toString(),
      },
    });

    if (!pathCheck.result.alternatives || pathCheck.result.alternatives.length === 0) {
      //throw new Error("No valid payment path exists between sender and recipient.");
      console.log("No valid payment path exists between sender and recipient.");
      console.log("ripple_path_find result: ", pathCheck);
    }

    const paymentTx = {
      TransactionType: "Payment",
      Account: holderWallet.classicAddress,
      Destination: vendorAddress,
      Amount: {
        currency,
        issuer: issuerWallet.classicAddress,
        value: amount.toString(),
      },
    };

    // Sign and submit the transaction
    const prepared = await client.autofill(paymentTx);
    const signed = holderWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    //console.log("Payment transaction result:", result);
    return result;
  } catch (error) {
    console.error("Error in transferTokens:", error);
    throw error;
  } finally {
    await client.disconnect();
  }
}

async function setInitialFlags() {
  const defaultRippleSetting = {
    TransactionType: "AccountSet",
    Account: issuerWallet.classicAddress,
    SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
  };
  
  const prepared = await client.autofill(defaultRippleSetting);
  const signed = issuerWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  console.log("DefaultRipple flag set:", result);  
}

module.exports = { displayWalletsAndBalances, validateWallet, createTrustLine, issueToken, sendXRP, transferTokens, setInitialFlags, transferTokensWrap };
