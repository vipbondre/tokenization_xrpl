const API_BASE = "http://localhost:3000";
let wallet = null; // To store the user's wallet

// Open a specific modal
function openStep1Popup(price) {
    document.getElementById("step1-modal").style.display = "flex";
    document.getElementById("ticket-price").textContent = `$${price}`;
    document.getElementById("step3-ticket-price").textContent = `$${price}`;
}

// Close any modal
function closePopup(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Step 1 Submission
function submitStep1() {
    const classicAddress = document.getElementById("classic-address").value;
    if (classicAddress) {
        closePopup("step1-modal");
        document.getElementById("step2-modal").style.display = "flex";
    } else {
        alert("Please enter a valid Classic Address.");
    }
}

// Step 2 Submission
function submitStep2() {
    const seed = document.getElementById("step2-seed").value;
    if (seed) {
        closePopup("step2-modal");
        document.getElementById("step3-modal").style.display = "flex";
    } else {
        alert("Please enter your seed.");
    }
}

// Step 3 Submission
function submitStep3() {
    const seed = document.getElementById("step3-seed").value;
    if (seed) {
        closePopup("step3-modal");
        document.getElementById("success-modal").style.display = "flex";
    } else {
        alert("Please enter your seed.");
    }
}


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
