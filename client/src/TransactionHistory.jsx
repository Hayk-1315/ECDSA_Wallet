import { useEffect, useState } from "react";
import server from "./server";

function TransactionHistory({ address }) {
  const [transactions, setTransactions] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible || !address) return;

    const fetchTransactions = async () => {
      try {
        const { data } = await server.get(`/transactions/${address}`);
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, [visible, address]);

  const toggleVisible = () => setVisible(!visible);

  return (
    <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6 max-w-md mx-auto space-y-4 mb-6">
      <button
        onClick={toggleVisible}
         className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded w-full transition"
         
      >
        {visible ? "Hide Transaction History" : "Show Transaction History"}
      </button>

      {visible && (
        <>
          <h3 className="text-lg font-bold text-blue-400 mt-4 mb-2">📜 Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-400">No transactions yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {transactions.map((tx, index) => (
                <li key={index} className="bg-gray-700 p-3 rounded">
                  <div><strong>From:</strong> {tx.sender}</div>
                  <div><strong>To:</strong> {tx.recipient}</div>
                  <div><strong>Amount:</strong> {tx.amount} ETH</div>
                  <div><strong>Date:</strong> {new Date(tx.date).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default TransactionHistory;