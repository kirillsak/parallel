import React, { useState, useEffect } from "react";
import axios from "axios";
import { Keyring } from "@polkadot/keyring";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { useUser } from "./UserContext";

function AuthComponent() {
  const [initiateSignup, setInitiateSignup] = useState(false);

  const [accountInfo, setAccountInfo] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [message, setMessage] = useState("");
  const { setLoggedInUser } = useUser();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      setLoggedInUser(username);
      setMessage(response.data.message);
      // Handle successful login here. Store tokens, navigate, etc.
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:3001/register", {
        username,
        email,
        password,
        address,
        mnemonic,
      });
      setMessage(response.data.message);
      setIsLogin(true);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const createAccount = () => {
    const keyring = new Keyring({ type: "sr25519" });

    const newMnemonic = mnemonicGenerate();
    const pair = keyring.addFromUri(newMnemonic, { name: username }, "ed25519"); // Add the name as meta

    // Store this pair in your application's keyring
    keyring.addPair(pair);

    const address = pair.address;
    setAddress(address);
    setMnemonic(newMnemonic);
    setInitiateSignup(true);
    return { address, mnemonic: newMnemonic, name: pair.meta.name };
  };

  const handleCreate = () => {
    const account = createAccount();
    setAccountInfo(account);
    // Now, initiate the signup process
    setInitiateSignup(true);
  };

  useEffect(() => {
    if (initiateSignup) {
      handleSignup();
      setInitiateSignup(false); // Reset for future signups
    }
  }, [initiateSignup]);

  return (
    <div>
      <h1>{isLogin ? "Login" : "Signup"}</h1>
      <div>
        <label>Username:</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {!isLogin && (
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
      )}
      <div>
        <label>Password:</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {message && <p>{message}</p>}
      {isLogin ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleCreate}>Signup</button>
      )}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Signup" : "Switch to Login"}
      </button>
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

export default AuthComponent;
