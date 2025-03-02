import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, hexToBytes, bytesToHex, toHex } from 'ethereum-cryptography/utils';

export function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}


export async function signTx(msgHash, address) {
  const privateKey = privateKeys[address];
    try {
        // 2. sign transaction
        const [signature, recovery] = await secp.sign(msgHash, hexToBytes(privateKey), {recovered: true});
        return [bytesToHex(signature), recovery]; // important to convert this to hex string to send as payload
      } catch(ex) {
        throw new Error('Failed to sign transaction');
    }
    
}

export function getAddress(publicKey) {
  return keccak256(publicKey.slice(1)).slice(-20);
}


export const privateKeys = {
  "0x7f72877a3096bd07435dee1264d4272ed508e331": "0xb93230bbb20f3eb54ddead0d5caeec1473e0454741739b062a58e29f1d872a53",
  "0x464c3b954321da28c51ab6c8f9c3ac8f16bd345d": "0xa073e14135cd54400fc1c8d8a98a62ee9c7c001ebc4a4d50c36e9b2f9755d80b",
  "0x2c1bee3d9be30127e5b26949da6fd2fbd6f497bc": "0x124c0e5d39ae5f7e8b955789a4026d8a3aa7034bd809d7b1bf99476ac6a6dcaf",
};
