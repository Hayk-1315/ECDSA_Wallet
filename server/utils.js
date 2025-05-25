import * as secp from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import {utf8ToBytes,hexToBytes,bytesToHex} from "ethereum-cryptography/utils.js";

//  Extrae address desde publicKey
export function getAddress(publicKey) {
  return keccak256(publicKey.slice(1)).slice(-20);
}
