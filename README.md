# 🔐 ECDSA-Wallet

A simulated Web3 wallet app that uses ECDSA cryptographic signatures for secure transactions between addresses. Built for educational and portfolio purposes using React, TailwindCSS, and a custom backend powered by Express and LowDB.

---

## 🧠 Summary

**ECDSA-Wallet** allows users to generate wallets (public/private key pairs), view balances, and send signed transactions to other wallets using elliptic curve cryptography. All data is persisted on the backend using a simple JSON-based database (`LowDB`), simulating real-world blockchain mechanics without needing an actual blockchain.

---

## 🔐 Features:

- 🔑 Generate public/private key pairs using ECDSA (secp256k1)
- 💾 Persist wallets in browser's `localStorage`
- 📥 Check balance of any address
- 🔒 Sign and verify transactions using private key (never exposed)
- ⚖️ Prevent transfers to self or with invalid signatures
- 📜 View transaction history (stored via LowDB)
- 🧹 Delete wallets and update UI in real-time
- 🎨 Stylish interface built with Tailwind CSS

---

## 🚀 Tech Stack:

| Frontend      | Backend      | Crypto & DB        |
|---------------|--------------|--------------------|
| React         | Express.js   | ethereum-cryptography |
| Tailwind CSS  | LowDB        | secp256k1 (ECDSA)  |
| Axios         | Node.js      | JSON persistence   |

---

## 📸 Screenshots:

### 💼 Wallet UI
![Wallet UI](./client/Screenshots/WalletUI.png)

### 💸 Transaction Form
![Transaction](./client/Screenshots/Transfer.png)

### 📜 Transaction History
![History](./client/Screenshots/History.png)

---

## 📦 Installation:

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ecdsa-wallet.git
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
🌐 Deployment
The project can be deployed in two parts:

Frontend on Vercel

Backend on Render or Railway

Once deployed, update this section:

🔗 Live Frontend: https://ecdsa-wallet.vercel.app  
🔗 Backend API:   https://ecdsa-wallet-api.onrender.com


🎓 Educational Value:
This project was developed from scratch during a blockchain development bootcamp and then significantly enhanced. It simulates real-world Web3 behavior without requiring an actual blockchain.

What you’ll learn:

🔐 Asymmetric cryptography using ECDSA

📩 Message signing & verification

🧭 Secure transaction flow with hash validation

💡 Designing a full-stack dApp architecture

🛠 Persisting data using LowDB as a lightweight backend

Perfect for newcomers who want to understand Web3 without diving straight into Solidity or deploying smart contracts.


🔮 Future Improvements:
🔐 Encrypt private keys in localStorage (AES)

🦊 MetaMask integration with ethers.js

🗃 Wallet export/import feature

📦 Migrate from LowDB to MongoDB or PostgreSQL

📡 Real-time updates with WebSockets

📱 Make it mobile responsive

🧪 Add full unit & integration tests


🧑‍💻 Author:
Made with ❤️ by Hayk-1315

Feel free to reach out or contribute!


📄 License:
This project is licensed under the MIT License.
You are free to fork, modify, and share for educational or personal use.






