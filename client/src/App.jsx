import { useState } from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Header from "./Header";
import TransactionHistory from "./TransactionHistory";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

   return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <Wallet
            address={address}
            setAddress={setAddress}
            balance={balance}
            setBalance={setBalance}
          />
          <Transfer
            address={address}
            setBalance={setBalance}
          />
          <TransactionHistory 
          address={address} 
          />
        </div>
      </div>
    </>
  );
}

export default App;