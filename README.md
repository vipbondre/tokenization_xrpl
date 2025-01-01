# Get Your Pass - Ticket Selling Website with XRPL Tokenization

## Overview  
The **Get Your Pass** website showcases a secure and private ticketing system powered by the XRP Ledger (XRPL). This system ensures privacy, security, and efficiency throughout the ticket purchase process, abstracting complexities and protecting sensitive user information.

### Problem Statement  
This PoC aims to address:  
- **Token Lifecycle Management**: Issuance, validation, and revocation of tickets as tokens.  
- **Privacy & Security**: Ensures transaction anonymity, protecting sensitive user details like ticket purchases.  
- **Offline Validation**: Supports ticket validation without continuous interaction with a central authority.  

#### Use Case Example:  
- **Ticketing System**: Tokens represent purchased tickets, ensuring the event organizer doesn’t know the user's identity, while the payment facilitator remains unaware of the ticket purpose.

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
