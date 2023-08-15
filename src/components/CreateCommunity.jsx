import React, { useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";

function CreateCommunity() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const createCommunity = async () => {
    const wsProvider = new WsProvider("ws://127.0.0.1:9944");
    const api = await ApiPromise.create({ provider: wsProvider });

    // Assuming you're using the Polkadot{.js} extension:
    const injected = await window.web3FromSource("polkadot-js");
    api.setSigner(injected.signer);

    // Get the current account from the extension
    const [currentAccount] = await injected.accounts.get();

    // Send the transaction
    await api.tx.yourPalletName
      .createCommunity(name)
      .signAndSend(currentAccount, ({ status, dispatchError }) => {
        if (status.isInBlock || status.isFinalized) {
          setStatus("Transaction included in " + status.asInBlock);
        } else if (dispatchError) {
          if (dispatchError.isModule) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { documentation, method, section } = decoded;
            setStatus(
              "Error: " +
                section +
                "." +
                method +
                ": " +
                documentation.join(" ")
            );
          } else {
            setStatus("Error: " + dispatchError.toString());
          }
        }
      });
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Community Name"
      />
      <button onClick={createCommunity}>Create Community</button>
      <p>{status}</p>
    </div>
  );
}

export default CreateCommunity;
