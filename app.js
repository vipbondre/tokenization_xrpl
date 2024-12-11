const API_BASE = "http://localhost:3000";

async function createTrustLine() {
  const currency = document.getElementById("currency").value;
  const limit = document.getElementById("limit").value;

  const holderSeed = prompt("Enter Holder Wallet Seed:");
  const response = await fetch(`${API_BASE}/trustline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ holderSeed, currency, limit }),
  });

  const result = await response.json();
  document.getElementById("output").innerText = JSON.stringify(result, null, 2);
}

async function issueToken() {
  const currency = document.getElementById("currency").value;
  const amount = document.getElementById("amount").value;

  const holderAddress = prompt("Enter Holder Wallet Address:");
  const response = await fetch(`${API_BASE}/issue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ holderAddress, currency, amount }),
  });

  const result = await response.json();
  document.getElementById("output").innerText = JSON.stringify(result, null, 2);
}

async function validateToken() {
  const address = document.getElementById("validateAddress").value;
  const currency = document.getElementById("currency").value;

  const response = await fetch(`${API_BASE}/validate/${address}/${currency}`);
  const result = await response.json();
  document.getElementById("output").innerText = JSON.stringify(result, null, 2);
}
