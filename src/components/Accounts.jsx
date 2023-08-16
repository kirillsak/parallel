import React, { useState, useEffect } from "react";
import {
  web3Accounts,
  web3FromSource,
  web3Enable,
} from "@polkadot/extension-dapp";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const allInjected = await web3Enable("MySubstrateApp");
      if (allInjected.length === 0) {
        // No extensions installed, or the user did not grant permissions.
        return;
      }

      const injectedAccounts = await web3Accounts();
      setAccounts(injectedAccounts);
    };

    fetchAccounts();
  }, []);

  const onSelectAccount = (account) => {
    setSelectedAccount(account);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        color: "white",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      {accounts.map((account) => (
        <button key={account.address} onClick={() => onSelectAccount(account)}>
          {account.meta.name}
        </button>
      ))}
    </div>
  );
}

export default Accounts;
