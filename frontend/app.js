const API_BASE = "http://localhost:3000";
let wallet = null; // To store the user's wallet

async function createWallet() {
  try {
    const response = await fetch(`${API_BASE}/create-wallet`);
    wallet = await response.json();
    document.getElementById("wallet-info").innerText = `Wallet Address: ${wallet.address}`;
  } catch (error) {
    document.getElementById("output").innerText = `Error: ${error.message}`;
  }
}

async function purchase(product, price) {
  if (!wallet) {
    alert("Please create a wallet first!");
    return;
  }

  try {
    // Step 1: Bank generates token
    const bankResponse = await fetch(`${API_BASE}/bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, price, holderAddress: wallet.address }),
    });

    const bankData = await bankResponse.json();
    if (bankData.error) {
      throw new Error(bankData.error);
    }

    // Step 2: Vendor verifies the token
    const vendorResponse = await fetch(`${API_BASE}/vendor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: bankData.token }),
    });

    const vendorData = await vendorResponse.json();
    if (vendorData.error) {
      throw new Error(vendorData.error);
    }

    document.getElementById("output").innerText = `Purchase successful! Product: ${product}, Price: ${price} XRP.`;
  } catch (error) {
    document.getElementById("output").innerText = `Error: ${error.message}`;
  }
}
