import { toHex, bytesToHex } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";
import { hashMessage, signTx} from "./utils";


function Transfer({ address, setBalance}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  //const [privateKey, setprivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  /*if (address) {
    setprivateKey(privateKeys[address])
  }*/
    
   /* async function klor (evt) {
      evt.preventDefault();
      if (address) {
        const {
          data: { privateKey },
        } = await server.get(`privateKey/${address}`);
        //setBalance(balance);
        setprivateKey(privateKey);
        //setNonce(nonce);
      } else {
        setprivateKey("");
      }
    }*/
     
    function validate(sendAmount, recipient) {
      if (!sendAmount || isNaN(parseInt(sendAmount))) {
          alert("Please enter a valid amount");
          return false;
        }
        if (!recipient || !recipient.startsWith("0x") || recipient.length !== 42) {
          alert("Please enter a valid recipient address");
          //return false;
        }
        return true;
      }
    
    async function transfer(evt) {
        evt.preventDefault();

        //if (!validate(sendAmount, recipient)) return;
        if (validate(sendAmount, recipient) === true)  {

          try {
          const transaction = {
            sender: address,
            amount: parseInt(sendAmount),
            recipient,
          }
          const msgHash = hashMessage(JSON.stringify(transaction));
          const msgHashString = bytesToHex(msgHash)
          const [signature,  recovery] = await signTx(msgHash, address);
    
          const {
            data: { balance },
          } = await server.post(`send`, {
            sender: address,
            amount: parseInt(sendAmount),
            recipient,
            signature,
            recovery,
            msgHashString,
           // msgHash: 
          });
          setBalance(balance);
        }
        catch (ex) {
          alert(response.data.message);
        }
      
  }
}
  return (
    <form className="container transfer" onSubmit={transfer} >
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Message Hash
        <span>
          {toHex(
            hashMessage(
              JSON.stringify({
                recipient,
                amount: parseInt(sendAmount),
                sender: address,
              })
            )
          )}
        </span>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
