import React, { useState, useEffect } from "react";
import axios from "axios";
import { Keyring } from "@polkadot/keyring";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { useUser } from "./UserContext";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";

function AuthComponent2() {
  const [initiateSignup, setInitiateSignup] = useState(false);

  const [accountInfo, setAccountInfo] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [message, setMessage] = useState("");
  const { setLoggedInUser } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('login'); // 'login' or 'signup'

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

  const handleOpenLogin = () => {
    setDialogType('login');
    setOpenDialog(true);
  };

  const handleOpenSignup = () => {
    setDialogType('signup');
    setOpenDialog(true);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenLogin}>
        Login
      </Button>
      <Button variant="contained" color="secondary" onClick={handleOpenSignup}>
        Signup
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogType === 'login' ? 'Login' : 'Signup'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {dialogType === 'signup' && (
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography color="error">
            {message}
          </Typography>
          {dialogType === 'login' ? (
            <Button color="primary" onClick={handleLogin}>
              Login
            </Button>
          ) : (
            <Button color="primary" onClick={handleCreate}>
              Signup
            </Button>
          )}
        </DialogContent>
      </Dialog>

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

export default AuthComponent2;
