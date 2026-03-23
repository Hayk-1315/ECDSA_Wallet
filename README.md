# ECDSA-Wallet

A simulated Web3 wallet app that uses ECDSA cryptographic signatures for secure transactions between addresses. Built with React, TailwindCSS, and a custom backend powered by Express and LowDB.

---

## Summary

ECDSA-Wallet allows users to generate wallets (public/private key pairs), view balances, and send signed transactions to other wallets using elliptic curve cryptography. All data is persisted on the backend using a simple JSON-based database (LowDB), simulating real-world blockchain mechanics without needing an actual blockchain.

---

## Live Demo

The app is deployed on:

- **Frontend (Vercel):** https://ecdsa-wallet.vercel.app
- **Backend (Render):** https://ecdsa-wallet-backend.onrender.com

---

## Features:

- Generate public/private key pairs using ECDSA (secp256k1)
- Persist wallets in browser's localStorage
- Check balance of any address
- Sign and verify transactions using private key (never exposed)
- Prevent transfers to self or with invalid signatures
- View transaction history (stored via LowDB)
- Delete wallets and update UI in real-time
- Stylish interface built with Tailwind CSS

---

## Tech Stack:

| Frontend     | Backend    | Crypto & DB           |
| ------------ | ---------- | --------------------- |
| React        | Express.js | ethereum-cryptography |
| Tailwind CSS | LowDB      | secp256k1 (ECDSA)     |
| Axios        | Node.js    | JSON persistence      |

---

## Installation:

```bash
# 1. Clone the repo
git clone https://github.com/Hayk-1315/ECDSA_Wallet.git
cd ecdsa-wallet

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Start backend server
cd ../server
npm start

# 5. Start frontend (in another terminal)
cd ../client
npm run dev
```

---

## What you’ll learn:

- Asymmetric cryptography using ECDSA
- Message signing & verification
- Secure transaction flow with hash validation
- Designing a full-stack dApp architecture
- Persisting data using LowDB as a lightweight backend

Perfect for newcomers who want to understand Web3 without diving straight into Solidity or deploying smart contracts.

---

## Future Improvements:

- Encrypt private keys in localStorage (AES)
- MetaMask integration with ethers.js
- Migrate from LowDB to MongoDB or PostgreSQL

---

## Author:

Made by Albert Khudaverdyan  
Feel free to reach out or contribute.

---

## License:

This project is licensed under the MIT License.  
You are free to fork, modify, and share for educational or personal use.
