import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// import { ApiPromise, WsProvider } from "@polkadot/api";
import React, { useState, useEffect } from "react";
import { List, ListItemButton, ListItemText } from "@mui/material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import { Divider } from "semantic-ui-react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { TxButton } from "../substrate-lib/components";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useUser } from './UserContext'
import axios from 'axios'
import { useSubstrate } from '../substrate-lib'


// const apiResponse = [
//   [
//     [0, "5FH7TJCApjJ3x79xfYe83M2a1LUbHtWkzhnq2GvN8kZq7FQT"],
//     null
//   ],
//   [
//     [0, "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"],
//     null
//   ]
// ];

function Header({ tokenLogo, tokenName }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
    >
      <Typography variant="h1" component="h1" sx={{ fontSize: "2.5rem" }}>
        Community Leadership
      </Typography>
    </Box>

  );
}

function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = useState(null)
  const [userAddress, setUserAddress] = useState('')
  const { loggedInUser } = useUser()
  const {
    setCurrentAccount,
    state: { keyring, currentAccount },
  } = useSubstrate()
  const [newAdmin, setNewAdmin] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setNewAdmin(event.target.value);
  };

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        console.log(`Fetching address for user: ${loggedInUser}`)

        if (loggedInUser) {
          console.log(loggedInUser)
          const response = await axios.get(
            `http://localhost:3001/getAddress/${loggedInUser}`
          )
          setUserAddress(response.data.address)
        }
      } catch (error) {
        console.error('Failed to fetch address:', error)
      }
    }

    fetchUserAddress()
  }, [loggedInUser])

  useEffect(() => {
    if (userAddress && !currentAccount) {
      setCurrentAccount(userAddress);
      console.log(`Set current account to ${userAddress}`)
    }
  }, [currentAccount, setCurrentAccount, keyring, userAddress])

  const communityId = 0;

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add admin
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: 'black' }}>Add admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="account"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={newAdmin} // controlled input
            onChange={handleInputChange} // handle the input change
            inputProps={{ style: { color: 'black' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
          <TxButton label="Submit" setStatus={setStatus} type="SIGNED-TX" attrs={{
            palletRpc: 'communities',
            callable: 'addAdmin',
            inputParams: [communityId, newAdmin],
            paramFields: [true, true],
          }} />
          <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// function Body({ balance, tokenAbbreviation }) {
//   return (
//     <Grid
//       container
//       spacing={1}
//       justifyContent={"center"}
//       alignItems={"baseline"}
//     >
//       <Grid item>
//         <Typography variant="h4" component="h3" sx={{ fontSize: "3rem" }}>
//           {balance}
//         </Typography>
//       </Grid>
//       <Grid item>
//         <Typography variant="subtitle2" component="h3">
//           {tokenAbbreviation}
//         </Typography>
//       </Grid>
//     </Grid>
//   );
// }

function AdminsCard(props) {
  // const [balance, setBalance] = useState(null);
  // const [api, setApi] = useState(null);
  const [communityHead, setCommunityHead] = useState('')
  const [api, setApi] = useState(null);
  const [items, setItems] = useState([]);


  useEffect(() => {
    const fetchCommunityAdmins = async () => {
      if (!api) return; // Ensure the API is set before fetching

      const communityId = 0;

      try {
        const allKeys = await api.query.communities.admins.keys(communityId);
        // console.log("Community Keys", allKeys);
        const adminAccountIds = allKeys.map(({ args: [, accountId] }) => accountId.toString());
        // console.log("Admin Account Ids", adminAccountIds);

        // const adminAccountIds = allKeys.map(({ args: [, accountId] }) => accountId);
        // const result = await api.query.communities.admins(communityId);
        // console.log(result);
        // console.log("Community Full result:", JSON.stringify(result, null, 2));
        // const jsonResult = result.toJSON();
        // console.log(jsonResult);

        // const extractedItems = jsonResult.map(result => result[0][1]);
        // console.log(extractedItems);
        setItems(adminAccountIds);

      } catch (error) {
        console.error("Error fetching fund account:", error);
      }
    };

    fetchCommunityAdmins();
  }, [api]);

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
    const fetchCommunityHead = async () => {
      if (!api) return; // Ensure the API is set before fetching

      const communityId = 0;

      try {
        const result = await api.query.communities.communities(communityId);
        // console.log(result);
        // console.log("Community Full result:", JSON.stringify(result, null, 2));
        const jsonResult = result.toJSON();
        // console.log(jsonResult);
        // console.log(jsonResult.head);
        // console.log("Type of jsonResult.fund:", typeof jsonResult.head);

        if (jsonResult && jsonResult.head !== undefined) { // Check if balance is not undefined
          // const humanReadableBalance = (typeof result.balance.toHuman === 'function')
          //   ? result.balance.toHuman()
          //   : result.balance.toString(); // If toHuman isn't available, just convert the balance to string

          setCommunityHead(jsonResult.head);
        } else {
          console.warn(
            "Unable to retrieve the 'free' balance or the result is unexpected."
          );

        }
      } catch (error) {
        console.error("Error fetching fund account:", error);
      }
    };

    fetchCommunityHead();
  }, [api]);


  // useEffect(() => {
  //   const setupApi = async () => {
  //     const wsProvider = new WsProvider("ws://127.0.0.1:9944");
  //     const api = await ApiPromise.create({ provider: wsProvider });
  //     setApi(api);
  //   };

  //   setupApi();

  //   return () => {
  //     api && api.disconnect(); // Close the WebSocket connection when component is unmounted
  //   };
  // }, []);


  return (
    <Card sx={{ backgroundColor: "#171717", borderRadius: "30px" }}>
      <Box
        paddingTop={2}
        paddingBottom={2}
        paddingLeft={3}
        paddingRight={3}
        minWidth={290}
      >
        <Box>
          <Header
          />
        </Box>
        <Box paddingLeft={2}>
          <Box
            display="flex"
            justifyContent="flex-start"
          >
            <Typography variant="h2" component="h1" sx={{ fontSize: "2rem" }}>
              HEAD
            </Typography>
          </Box>
        </Box>
        <Divider />
        <List>
          <ListItemButton sx={{ borderRadius: '50px' }}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={communityHead} />
          </ListItemButton>
        </List>
        <Box paddingLeft={2} marginTop={4}>
          <Box
            display="flex"
            justifyContent="flex-start"
          >
            <Typography variant="h2" component="h1" sx={{ fontSize: "2rem" }}>
              ADMINS
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box>
          <List>
            {items.map((item, index) => (
              <ListItemButton key={index} sx={{ borderRadius: '50px' }}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Divider />
        <Box>
          <FormDialog />
        </Box>
      </Box>

    </Card>
  );
}

export default AdminsCard;
