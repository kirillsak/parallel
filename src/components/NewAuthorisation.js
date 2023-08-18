import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Keyring } from "@polkadot/keyring";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import { useUser } from "./UserContext";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import { useSubstrate } from '../substrate-lib'

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    state: { keyring },
  } = useSubstrate()

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      setLoggedInUser(username);
      setMessage(response.data.message);
      setIsLoggedIn(true); // Update the logged-in state
      // Handle successful login here. Store tokens, navigate, etc.
      // const response2 = await axios.get(
      //   `http://localhost:3001/getAddress/${username}`
      // )
      // const address = response2.data.address
      // setCurrentAccount(keyring.getPair(address))
      // console.log("Current Account is: ", currentAccount)
      console.log('All key pairs after adding', JSON.stringify(keyring.getPairs()));
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
    // console.log('All key pairs before keyring', JSON.stringify(keyring.getPairs()));
    // const keyring = new Keyring({ type: "sr25519" });

    // console.log('All key pairs before adding', JSON.stringify(keyring.getPairs()));
    const newMnemonic = mnemonicGenerate();
    // console.log(keyring);
    // const allPropertiesAndMethods = [
    //   ...Object.getOwnPropertyNames(keyring),
    //   ...Object.getOwnPropertyNames(Object.getPrototypeOf(keyring))
    // ];
    // console.log(allPropertiesAndMethods);
    // const pair = keyring.createFromUri(newMnemonic, { name: username }, "sr25519"); // Add the name as meta
    const { pair, json } = keyring.addUri(newMnemonic, 'myStr0ngP@ssworD', { name: username });
    console.log(json);

    // Store this pair in your application's keyring
    // keyring.addPair(pair);

    console.log('All key pairs after adding', JSON.stringify(keyring.getPairs()));

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

  const handleSignOut = () => {
    // Reset the user's state
    setUsername("");
    setEmail("");
    setPassword("");
    setAddress("");
    setMnemonic("");
    setMessage("");
    setLoggedInUser(null); // assuming the useUser context handles this appropriately
    setIsLoggedIn(false);
    handleClose(); // close the dropdown menu

    window.location.reload();
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <IconButton onClick={handleClick}>
            <Avatar>
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleSignOut} sx={{ color: 'black' }} >
              <Button variant="outlined" color="primary">
                Sign Out
              </Button>
            </MenuItem>
          </Menu>
        </div> // Display an avatar with the first character of the username
      ) : (
        <>
          <Button variant="contained" sx={{ borderRadius: '50px' }} color="primary" onClick={handleOpenLogin}>
            Login
          </Button>
          <Button variant="outlined" sx={{ borderRadius: '50px' }} onClick={handleOpenSignup}>
            Signup
          </Button>
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogType === 'login' ? 'Login' : 'Signup'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{ style: { color: 'black' } }}
          />
          {dialogType === 'signup' && (
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{ style: { color: 'black' } }}
            />
          )}
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ style: { color: 'black' } }}
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
