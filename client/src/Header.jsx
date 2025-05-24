function Header() {
  return (
    <header className="bg-gray-950 text-white py-4 shadow-md">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">🔐 ECDSA Wallet</h1>
        <span className="text-sm text-gray-400">powered by secp256k1</span>
      </div>
    </header>
  );
}

export default Header;