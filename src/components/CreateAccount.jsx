import React, { useState } from "react";
import { Keyring } from "@polkadot/keyring";
import { mnemonicGenerate } from "@polkadot/util-crypto";

function AccountCreator() {
  const [accountInfo, setAccountInfo] = useState({});
  const [name, setName] = useState(""); // to store the name

  const createAccount = () => {
    const keyring = new Keyring({ type: "sr25519" });

    const newMnemonic = mnemonicGenerate();
    const pair = keyring.addFromUri(newMnemonic, { name: name }, "ed25519"); // Add the name as meta

    // Store this pair in your application's keyring
    keyring.addPair(pair);

    const address = pair.address;
    return { address, mnemonic: newMnemonic, name: pair.meta.name };
  };

  const handleCreate = () => {
    const account = createAccount();
    setAccountInfo(account);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter account name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreate}>Create New Account</button>

      {accountInfo.address && (
        <div>
          <h3>New Account Created!</h3>
          <p>Name: {accountInfo.name}</p>
          <p>Address: {accountInfo.address}</p>
          <p>Mnemonic: {accountInfo.mnemonic}</p>
          <strong>
            Save your mnemonic safely! It's crucial for account recovery.
          </strong>
        </div>
      )}
    </div>
  );
}

export default AccountCreator;
