import { toHex, bytesToHex } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";
import { hashMessage, signTx } from "./utils";
import Toast from "./Toast";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const validate = () => {
    if (!sendAmount || isNaN(sendAmount) || sendAmount <= 0) {
      setError("⚠️ Invalid amount");
      return false;
    }
    if (!recipient || !recipient.startsWith("0x") || recipient.length !== 42) {
      setError("⚠️ Invalid recipient address");
      return false;
    }
    if (recipient.toLowerCase() === address.toLowerCase()) {
       setError("❌ Cannot send funds to your own address.");
       return false;
}
    return true;
  }

  const transfer = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!validate()) return;

    setIsLoading(true);
    setStatus("🔐 Signing transaction...");

    try {
      const transaction = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      };
      const msgHash = hashMessage(JSON.stringify(transaction));
      const msgHashString = bytesToHex(msgHash);
      const [signature, recovery] = await signTx(msgHash, address);
      
      await new Promise((resolve) => setTimeout(resolve, 6000));

      const {
        data: { balance },
      } = await server.post("/send", {
        ...transaction,
        signature,
        recovery,
        msgHashString,
      });

      setBalance(balance);
      setStatus("✅ Transaction successful");
      setSendAmount("");
      setRecipient("");
      setToast({ message: "✅ Transaction successful", type: "success" });
      setTimeout(() => setToast(null), 9000);

    } catch (err) {
      console.error("Transfer failed:", err);
      setError(err.response?.data?.message || "❌ Transaction failed. Check console.");
      setToast({message:err.response?.data?.message || "❌ Transaction failed", type: "error",});
    } finally {
      setIsLoading(false);
      setTimeout(() => setToast(null), 6000);
    }
   }

    return (
    <>
      <form
        onSubmit={transfer}
        className="bg-gray-800 text-white rounded-xl shadow-lg p-6 space-y-4 max-w-md mx-auto"
      >
        <h2 className="text-xl font-bold text-blue-400">💸 Transfer</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 10"
            value={sendAmount}
            onChange={setValue(setSendAmount)}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recipient</label>
          <input
            placeholder="0x..."
            value={recipient}
            onChange={setValue(setRecipient)}
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        {status && <p className="text-green-400 text-sm">{status}</p>}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full block mx-auto" />
          ) : (
            "Transfer"
          )}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default Transfer;