const API_BASE = "http://localhost:3000";
let wallet = null; // To store the user's wallet
let selectedProduct;
let priceOfProduct;

// Open a specific modal
function openStep1Popup(product, price) {
    selectedProduct = product;
    priceOfProduct = price;
    document.getElementById("step1-modal").style.display = "flex";
    document.getElementById("ticket-price").textContent = `$${price}`;
    //document.getElementById("step3-ticket-price").textContent = `$${price}`;
    //console.log("Product and price set:", selectedProduct, priceOfProduct);
}

// Close any modal
function closePopup(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Step 1 Submission
async function submitStep1() {
    let holderSeed = document.getElementById("step1-seed").value;
    try {
      const trustline = await fetch(`${API_BASE}/create-trustline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holderSeed: holderSeed }),
      });
      wallet = await trustline.json();
      if (wallet.error) {
        alert("Please enter a valid Seed.");
        //throw new Error(bankData.error);
      } else {
        closePopup("step1-modal");
        document.getElementById("step2-modal").style.display = "flex";
      }
    } catch (error) {
      //document.getElementById("output").innerText = `Error: ${error.message}`;
      alert("Please enter a valid Seed.");
    }
}

// Step 2 Submission
async function submitStep2() {
    let holderAddress = document.getElementById("step2-seed").value;
    try {
      const trustline = await fetch(`${API_BASE}/generate-tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holderAddress: holderAddress, price: priceOfProduct}),
      });
      wallet = await trustline.json();
      if (wallet.error) {
        alert("Please enter a valid classic Address.");
        //throw new Error(bankData.error);
      } else {
        closePopup("step2-modal");
        document.getElementById("step3-modal").style.display = "flex";
      }
    } catch (error) {
      //document.getElementById("output").innerText = `Error: ${error.message}`;
      alert("Please enter a valid classic Address.");
    }
}

// Step 3 Submission
async function submitStep3() {
  let holderSeed = document.getElementById("step3-seed").value;
  try {
    const trustline = await fetch(`${API_BASE}/transfer-tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ holderSeed: holderSeed, price: priceOfProduct, product: selectedProduct }),
    });
    wallet = await trustline.json();
    if (wallet.error) {
      alert("Please enter a valid Seed.");
      //throw new Error(bankData.error);
    } else {
      closePopup("step3-modal");
      document.getElementById("success-modal").style.display = "flex";
    }
  } catch (error) {
    //document.getElementById("output").innerText = `Error: ${error.message}`;
    alert("Please enter a valid Seed.");
  }
}

// ------------------------------------------------------- End of Code in Action -------------------------------------------------------------------

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
