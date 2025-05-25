import * as secp from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import {utf8ToBytes,hexToBytes,bytesToHex} from "ethereum-cryptography/utils.js";

// Hasheo de mensaje
export function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

// Firma de transacción con la clave privada guardada en localStorage
export async function signTx(msgHash, address) {
  const wallets = JSON.parse(localStorage.getItem("wallets")) || [];
  const wallet = wallets.find((w) => w.address === address);

  if (!wallet) {
    throw new Error("Private key not found for address");
  }

  try {
    const [signature, recovery] = await secp.sign(
      msgHash,
      hexToBytes(wallet.privateKey),
      { recovered: true }
    );
    return [bytesToHex(signature), recovery];
  } catch (ex) {
    throw new Error("Failed to sign transaction");
  }
}

// Extrae address desde publicKey
  export function getAddress(publicKey) {
  return keccak256(publicKey.slice(1)).slice(-20);
}


