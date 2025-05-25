const express = require("express");
const app = express();
const cors = require("cors");
const secp = require('ethereum-cryptography/secp256k1');
const { hexToBytes, toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");
const port = process.env.PORT || 3042;
const router = express.Router();
const { getAddress } = require("./scripts/utils.js");
app.use(cors());
app.use(express.json());

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");  
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ balances: {}, transactions: [] }).write();


router.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = db.get('balances').get(address).value() || 0;
  res.send({ balance });
});

router.get("/transactions/:address", (req, res) => {
  const { address } = req.params;
  const txs = db.get("transactions")
    .filter(tx => tx.sender === address || tx.recipient === address)
    .value();
  res.send({ transactions: txs });
});

router.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature, msgHashString, recovery } = req.body;

 if (sender.toLowerCase() === recipient.toLowerCase()) {
  return res.status(400).send({ message: "Sender and recipient cannot be the same address." });
}

 try {
   const publicKey = secp.recoverPublicKey(hexToBytes(msgHashString), hexToBytes(signature), recovery);
  // verify that last 20 bytes of the public key are the same as the address
  const address = getAddress(publicKey);
  const isValidPubKey = toHex(address) === sender.slice(2);

  if (!isValidPubKey) {
    return res.status(400).send({ message: "Signature is not signed by the sender" });
  }

  // verify that the signature and message are coming from the owner of the public key
  const isSigned = secp.verify(hexToBytes(signature), hexToBytes(msgHashString), publicKey);
  if (!isSigned) {
    return res.status(400).send({ message: "Invalid signature!" });
  }
 // Leer balances desde LowDB
    const balances = db.get("balances").value();
    const senderBalance = balances[sender] || 0;
    const recipientBalance = balances[recipient] || 0;

    if (!balances[sender]) {
      return res.status(400).send({ message: "Sender not registered!" });
    }

    if (!balances[recipient]) {
      return res.status(400).send({ message: "Recipient not registered!" });
    }

    if (senderBalance < amount) {
      return res.status(400).send({ message: "Insufficient funds!" });
    }

    // Actualizar balances
    db.get("balances").set(sender, senderBalance - amount).write();
    db.get("balances").set(recipient, recipientBalance + amount).write();

    db.get("transactions")
  .push({
    sender,
    recipient,
    amount,
    date: new Date().toISOString(),
    signature,
    hash: msgHashString
  })
  .write();

    res.send({ balance: senderBalance - amount });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
  })

router.post("/register", (req, res) => {
  const { address } = req.body;

  if (!address || !address.startsWith("0x")) {
    return res.status(400).send({ message: "Dirección inválida" });
  }

  const existingBalance = db.get('balances').get(address).value();

  if (existingBalance === undefined) {
    db.get('balances').set(address, 100).write();
    return res.status(201).send({ message: "Wallet registrada", balance: 100 });
  }

  return res.status(200).send({ message: "Ya registrada", balance: existingBalance });
});

router.delete("/wallet/:address", (req, res) => {
  const { address } = req.params;

  const exists = db.get("balances").has(address).value();

  if (!exists) {
    return res.status(404).send({ message: "Wallet not found" });
  }

  db.get("balances").unset(address).write();
  res.send({ message: "Wallet deleted from DB" });
});

// Debug endpoint para consultar el estado completo de la base de datos
router.get("/debug", (req, res) => {
  const token = req.query.token;

  // Autenticación básica por token
  if (token !== "12345") {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const fullData = db.getState(); // contiene balances y transactions
    res.status(200).send(fullData);
  } catch (err) {
    res.status(500).send({ message: "Error leyendo base de datos" });
  }
});

app.use("/api", router);


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});


module.exports = app;
