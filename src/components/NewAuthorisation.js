import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import { Keyring } from "@polkadot/keyring";
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { useUser } from './UserContext'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import { useSubstrate } from '../substrate-lib'

function AuthComponent2() {
  const storedUser = sessionStorage.getItem('loggedInUser')

  const [initiateSignup, setInitiateSignup] = useState(false)
  const [accountInfo, setAccountInfo] = useState({})
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [message, setMessage] = useState('')
  const { loggedInUser, setLoggedInUser } = useUser()
  // const { loggedInUser, setLoggedInUser, profileImage, setProfileImage } =
  //   useUser()
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('login') // 'login' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedUser)
  const [anchorEl, setAnchorEl] = useState(null)

  // const storedProfilePicture = sessionStorage.getItem('profilePicture')
  // const [profilePicture, setProfilePicture] = useState(
  //   storedProfilePicture || null
  // )

  const {
    setCurrentAccount,
    state: { keyring },
  } = useSubstrate()

  // Opens the dropdown menu from the avatar button
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the dropdown menu
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenLogin = () => {
    setDialogType('login');
    setOpenDialog(true);
  };

  const handleOpenSignup = () => {
    setDialogType('signup');
    setOpenDialog(true);
  };

  const handleLogin = async () => {
    try {
      // Sending the username and password to a login endpoint
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      })
      setLoggedInUser(username)
      setIsLoggedIn(true) // Update the logged-in state
      sessionStorage.setItem("loggedInUser", username);
      setMessage(response.data.message)

      // const profilePicResponse = await axios.get(
      //   `http://localhost:3001/getProfilePic/${username}`
      // )
      // setProfilePicture(profilePicResponse.data.profilePic)

      const response2 = await axios.get(
        `http://localhost:3001/getAddress/${username}`
      )

      setCurrentAccount(response2.data.address);

    } catch (error) {
      setMessage(error.response.data.message)
    }
  }

  const handleCreate = () => {
    const account = createAccount();
    setAccountInfo(account);
    setInitiateSignup(true);
  };

  const createAccount = () => {
    const newMnemonic = mnemonicGenerate();
    const { pair, json } = keyring.addUri(newMnemonic, 'myStr0ngP@ssworD', { name: username });
    console.log(json);

    const address = pair.address;
    setAddress(address);
    setMnemonic(newMnemonic);
    return { address, mnemonic: newMnemonic, name: pair.meta.name };
  };

  const handleSignup = useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:3001/register", {
        username,
        firstName,
        lastName,
        email,
        password,
        address,
        mnemonic,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  }, [username, firstName, lastName, email, password, address, mnemonic]);

  // const handleUploadClick = e => {
  //   const input = document.getElementById('profile-picture-upload')
  //   input.click()
  // }

  // const handleProfilePictureChange = async e => {
  //   const file = e.target.files[0]
  //   setProfilePicture(URL.createObjectURL(file))

  //   const formData = new FormData()
  //   formData.append('profilePic', file)

  //   formData.append('username', username)

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:3001/uploadProfilePic',
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     )

  //     // The backend responds with the saved image's URL or relative path.

  //     // Save this imageUrl to the user's state:
  //     const backendURL = 'http://localhost:3001' // or wherever your backend is hosted
  //     const completeImageUrl = backendURL + response.data.imageUrl
  //     setProfileImage(completeImageUrl) // Update the context
  //     sessionStorage.setItem('profilePicture', completeImageUrl) // Update the sessionStorage
  //     setProfilePicture(completeImageUrl)
  //   } catch (error) {
  //     console.log('Failed to upload image:', error)
  //   }
  // }


  useEffect(() => {
    if (initiateSignup) {
      handleSignup();
      setInitiateSignup(false);
    }
  }, [initiateSignup, handleSignup]);



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
    setCurrentAccount(null);
    sessionStorage.removeItem("loggedInUser");
    handleClose(); // close the dropdown menu

    window.location.reload()
  }

  const resetAccountInfo = () => {
    setAccountInfo({});
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <IconButton onClick={handleClick}>
            {/* <Avatar src={profilePicture || profileImage}>
              {!profileImage && !profilePicture
                ? loggedInUser.charAt(0).toUpperCase()
                : null}
            </Avatar> */}
            <Avatar>
              {loggedInUser.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* <MenuItem onClick={handleUploadClick} sx={{ color: 'black' }}>
              <input
                type="file"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="profile-picture-upload">
                Upload Profile Picture
              </label>
            </MenuItem> */}
            <MenuItem onClick={handleSignOut} sx={{ color: 'black' }}>
              <Button variant="outlined" color="primary">
                Sign Out
              </Button>
            </MenuItem>
          </Menu>
        </div> // Display an avatar with the first character of the username
      ) : (
        <>
          <Button
            variant="contained"
            sx={{ borderRadius: '50px' }}
            color="primary"
            onClick={handleOpenLogin}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: '50px' }}
            onClick={handleOpenSignup}
          >
            Signup
          </Button>
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          resetAccountInfo();
        }}
      >
        <DialogTitle style={{ color: 'black' }}>{dialogType === 'login' ? 'Login' : 'Signup'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            inputProps={{ style: { color: 'black' } }}
          />
          {dialogType === 'signup' && (
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              inputProps={{ style: { color: 'black' } }}
            />
          )}
          {dialogType === 'signup' && (
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              inputProps={{ style: { color: 'black' } }}
            />
          )}
          {dialogType === 'signup' && (
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              inputProps={{ style: { color: 'black' } }}
            />
          )}
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            inputProps={{ style: { color: 'black' } }}
          />

          <Typography color="error">{message}</Typography>
          {dialogType === 'login' ? (
            <Button color="primary" onClick={handleLogin}>
              Login
            </Button>
          ) : (
            <Button color="primary" onClick={handleCreate}>
              Signup
            </Button>
          )}

          {accountInfo.address && (
            <div>
              <h3 style={{ color: 'black' }}>New Account Created!</h3>
              <p style={{ color: 'black' }}>Name: {accountInfo.name}</p>
              <p style={{ color: 'black' }}>Address: {accountInfo.address}</p>
              <p style={{ color: 'black' }}>Mnemonic: {accountInfo.mnemonic}</p>
              <strong style={{ color: 'black' }}>
                Save your mnemonic safely! It's crucial for account recovery.
              </strong>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>

  )
}

export default AuthComponent2
