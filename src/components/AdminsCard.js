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


const apiResponse = [
  [
    [0, "5FH7TJCApjJ3x79xfYe83M2a1LUbHtWkzhnq2GvN8kZq7FQT"],
    null
  ],
  [
    [0, "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"],
    null
  ]
];

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
    const extractedItems = apiResponse.map(result => result[0][1]);
    console.log(extractedItems);
    setItems(extractedItems);
  }, []); // Empty dependency array to run only once



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
        console.log(result);
        console.log("Community Full result:", JSON.stringify(result, null, 2));
        const jsonResult = result.toJSON();
        console.log(jsonResult);
        console.log(jsonResult.head);
        console.log("Type of jsonResult.fund:", typeof jsonResult.head);

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

  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     if (!api) return; // Ensure the API is set before fetching

  //     const accountAddress = props.address; // Using address to fetch balance

  //     try {
  //       const result = await api.query.system.account(accountAddress);
  //       console.log("Account result:", result);
  //       console.log("Account Full result:", JSON.stringify(result, null, 2));

  //       if (result && result.data && result.data.free) {
  //         const humanReadableBalance = result.data.free.toHuman();
  //         setBalance(humanReadableBalance);
  //       } else {
  //         console.warn(
  //           "Unable to retrieve the 'free' balance or the result is unexpected."
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error fetching account balance:", error);
  //     }
  //   };

  //   fetchBalance();
  // }, [props.address, api]);
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
      </Box>
    </Card>
  );
}

export default AdminsCard;
