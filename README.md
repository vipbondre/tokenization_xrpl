# 🎟️ Get Your Pass – Private & Secure Ticketing on XRPL

> 🏆 **Winner of the Hackathon** conducted by [@XRPLLabs](https://twitter.com/XRPLLabs) in collaboration with **IIT Bombay**  
> 📢 Official results: [https://isrdc.in/blockchain-hackathon/](https://isrdc.in/blockchain-hackathon/)

---

## 🌐 Overview

**Get Your Pass** is a **secure**, **privacy-focused** ticketing system powered by the **XRP Ledger (XRPL)**.

This system ensures:
- 🔐 **Privacy**
- ⚡ **Security**
- 🔄 **Efficiency**

All while abstracting blockchain complexities and protecting sensitive user data throughout the ticket purchase and validation process.

---

## 🧠 Problem Statement

This Proof of Concept (PoC) aims to solve:

- 🔄 **Token Lifecycle Management**  
  Issue, validate, and revoke tickets seamlessly as XRPL tokens.

- 🕵️‍♂️ **Privacy & Security**  
  Transactions are anonymous. Event organizers never see user identities. Payment facilitators don’t know what’s being purchased.

- 📴 **Offline Validation**  
  Tickets can be validated without constant connection to a central authority — ideal for real-world events and venues.

---

## 🎯 Use Case Example: Ticketing System

- 🎫 **Tickets as Tokens**: Purchased tickets are represented as XRPL tokens.  
- 🧍‍♂️ ➖ 🎟️ ➖ 🧍‍♀️: User identity is hidden from event organizers.  
- 💳 ➖ ❓: Payment facilitators have no visibility into the ticketing purpose.  
- ✅ **Offline Ticket Scanning**: No need for constant backend or internet access.

---

## 🤝 Let's Connect!

Open to collaborations, contributions, or exploring real-world use cases together.  
Feel free to fork ⭐ the repo or reach out!

---

## Setup & Installation

### Backend  
1. Navigate to the `backend` directory:  
   ```bash  
   cd backend  
   npm init -y  
   npm install express body-parser cors xrpl  
   ```  

2. Start the backend server:  
   ```bash  
   node server.js  
   ```  

### Frontend  
1. Navigate to the `frontend` directory:  
   ```bash  
   cd frontend  
   npm install  
   npx serve  
   ```  

---

## How to Run  

1. **Install Backend Dependencies:**  
   ```bash  
   npm install express body-parser cors xrpl  
   ```  

2. **Start Backend Server:**  
   ```bash  
   node server.js  
   ```  

3. **Open Frontend:**  
   - Navigate to the `frontend` directory and open `index.html` in your browser.  
   - Interact with the ticket-selling interface:  
     - Create wallets.  
     - Establish trust lines.  
     - Purchase tickets using XRPL tokens.  

---

## Key Features  

- **Token Issuance & Trust Lines**: Secure token issuance and trust line establishment for ticket sales.  
- **Ticketing System Integration**: Token-based ticket purchases ensuring privacy and secure transactions.  
- **Private Transactions**: Tokens hide transaction details, ensuring user anonymity.  
- **Offline Validation**: Tickets validated without constant interaction with the ticket issuer.  

---

## Conclusion  
The **Get Your Pass** ticketing website provides a robust framework for XRPL-based ticketing systems, enabling secure, privacy-preserving ticket sales and enhancing the user experience through seamless, token-driven transactions.

## Project Report
https://drive.google.com/file/d/1nudxpmAFan1c9tl0-rQVqDqFMG68ONhN/view?usp=sharing
