import { useState, useEffect } from "react";
import server from "./server";
import { getAddress } from "./utils.js";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance }) {
  const [error, setError] = useState("");
  const [wallets, setWallets] = useState([]);
  const [manualAddress, setManualAddress] = useState("");
  const [showWallets, setShowWallets] = useState(false);

  // Al iniciar, cargar wallets desde localStorage
  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("wallets")) || [];
    setWallets(stored);
  }, []);
  
  // Guardar wallet nueva en localStorage
  function saveWallet(addr, privKey) {
  const updated = [...wallets, { address: addr, privateKey: privKey }];
  localStorage.setItem("wallets", JSON.stringify(updated));
  setWallets(updated);
  }
  
  // Consultar balance desde backend
  async function fetchBalance(addr) {
     try {
      const {
        data: { balance },
      } = await server.get(`balance/${addr}`);
      setBalance(balance);
    } catch {
      setBalance(0);
      
      setError("⚠️ Error al obtener el balance");
    }
  }
    
   // Crear nueva wallet y registrarla en backend
  async function generateWallet() {
    setError("");
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const publicKey = secp.getPublicKey(privateKey);
    const addr = `0x${toHex(getAddress(publicKey))}`;

    saveWallet(addr, privateKey);
    setAddress(addr);

    try {
      const { data } = await server.post("/register", { address: addr });
      setBalance(data.balance);
      alert(data.message);
    } catch (err) {
      console.error("Error al registrar:", err.message);
      setError("⚠️ Error al registrar wallet en el servidor");
    }
  }
  
  function loadWallet(wallet) {
    setAddress(wallet.address);
    fetchBalance(wallet.address);
  }

  async function deleteWallet(addr) {
    const updated = wallets.filter(w => w.address !== addr);
    setWallets(updated);
    localStorage.setItem("wallets", JSON.stringify(updated));
    if (address === addr) {
      setAddress("");
      setBalance(0);
    }
    try {
    await server.delete(`/wallet/${addr}`);
    console.log(`Wallet ${addr} deleted from server`);
  } catch (err) {
    console.error("Error deleting wallet from server:", err);
  }
  }

  function checkManualBalance() {
    setError("");
    setAddress(manualAddress);
    fetchBalance(manualAddress);
  }

  
   return (
    <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6 max-w-md mx-auto space-y-4 mb-6">
      <h1 className="text-2xl font-bold text-center text-blue-400">💼 Wallet</h1>

      <button
        onClick={generateWallet}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold w-full transition"
      >
        ➕ Generate New Wallet

      </button>
      <button
       onClick={() => setShowWallets(!showWallets)}
       className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
      {showWallets ? "🔽 Hide Saved Wallets" : "📂 Show Saved Wallets"}
     </button>

      {/* Lista de wallets locales */}
      {showWallets && wallets.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-yellow-400 mt-4 mb-2">Saved Wallets</h3>
          <ul className="space-y-2">
            {wallets.map((w, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-gray-700 p-2 rounded">
                <div className="flex items-center space-x-2">
                 <span title={w.address}>
                    {w.address.slice(0, 6)}...{w.address.slice(-4)}
                 </span>
                 <button
                onClick={() => navigator.clipboard.writeText(w.address)}
                className="bg-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-500"
                title="Copy full address"
                >
                  📋  
              </button>
                  </div>
                <div className="space-x-2">
                  <button onClick={() => loadWallet(w)} className="bg-blue-500 px-2 py-1 rounded text-xs">Load</button>
                  <button onClick={() => deleteWallet(w.address)} className="bg-red-500 px-2 py-1 rounded text-xs">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Consulta manual */}
      <div className="mt-4">
        <label className="text-sm font-medium mb-1 block">🔍 Check Balance (manual)</label>
        <input
          type="text"
          placeholder="0x..."
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 mb-2"
        />
        <button
          onClick={checkManualBalance}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded font-semibold"
        >
          📥 Check Balance
        </button>
      </div>

      {address && (
        <div className="text-sm text-gray-300">
          <strong>Active Address:</strong>{" "}
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}

      <div className="text-green-400 text-lg font-semibold">Balance: {balance} ETH</div>
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
    </div>
  );
}

export default Wallet;
