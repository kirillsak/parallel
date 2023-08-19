import React, { useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";

function User(props) {
  const [balance, setBalance] = useState(null);
  const [api, setApi] = useState(null);

  useEffect(() => {
    const setupApi = async () => {
      const wsProvider = new WsProvider("ws://127.0.0.1:9944");
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
    };

    setupApi();

    return () => {
      api && api.disconnect(); // Close the WebSocket connection when component is unmounted
    };
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!api) return; // Ensure the API is set before fetching

      const accountAddress = props.address; // Using address to fetch balance

      try {
        const result = await api.query.system.account(accountAddress);
        // console.log("Account result:", result);

        if (result && result.data && result.data.free) {
          const humanReadableBalance = result.data.free.toHuman();
          setBalance(humanReadableBalance);
        } else {
          console.warn(
            "Unable to retrieve the 'free' balance or the result is unexpected."
          );
        }
      } catch (error) {
        console.error("Error fetching account balance:", error);
      }
    };

    fetchBalance();
  }, [props.address, api]);

  return (
    <div
      style={{
        backgroundColor: "white",
        color: "black",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      {balance && (
        <div>
          <h2>Address: {props.address}</h2>
          <p>Balance: {balance}</p>
        </div>
      )}
    </div>
  );
}

export default User;
