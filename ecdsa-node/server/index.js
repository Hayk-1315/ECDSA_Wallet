const express = require("express");
const app = express();
const cors = require("cors");
const secp = require('ethereum-cryptography/secp256k1');
const { hexToBytes, toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");
const port = process.env.PORT || 3042;
const router = express.Router();
const { getAddress } = require("./scripts/generate");
app.use(cors());
app.use(express.json());


const balances = {
  "0x7f72877a3096bd07435dee1264d4272ed508e331": 100,
  "0x464c3b954321da28c51ab6c8f9c3ac8f16bd345d": 50,
  "0x2c1bee3d9be30127e5b26949da6fd2fbd6f497bc": 75,
};

router.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

router.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, msgHashString, recovery } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
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

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

module.exports = app;
