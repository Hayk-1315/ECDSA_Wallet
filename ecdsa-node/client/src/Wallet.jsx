import server from "./server";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  
}) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance},
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type address starting with 0x"
          value={address}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Address:
        <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
