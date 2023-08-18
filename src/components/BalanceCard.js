import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { useSubstrateState } from '../substrate-lib'
import { hexToString } from '@polkadot/util';


function Header({ tokenLogo, tokenName }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box>
        <img
          src={tokenLogo}
          alt={tokenName}
          className="balancecard-token-logo"
          width="32"
          height="32"
        />
      </Box>
      <Box>
        <Typography variant="h2" component="h2" sx={{ fontSize: "1.5rem" }}>
          {tokenName}
        </Typography>
      </Box>
    </Box>
  );
}

function Body({ balance, tokensymbol }) {
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"center"}
      alignItems={"baseline"}
    >
      <Grid item>
        <Typography variant="h4" component="h3" sx={{ fontSize: "3rem" }}>
          {balance}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle2" component="h3">
          {tokensymbol}
        </Typography>
      </Grid>
    </Grid>
  );
}

function BalanceCard(props) {
  const [balance, setBalance] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const { api } = useSubstrateState()

  // const [api, setApi] = useState(null);

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

  useEffect(() => {
    const fetchBalance = async () => {
      if (!api) return; // Ensure the API is set before fetching

      const accountAddress = props.address; // Using address to fetch balance
      // const assetId = 0;

      try {
        const result = await api.query.assets.account(0, accountAddress);
        // console.log(result);
        // console.log("Full result:", JSON.stringify(result, null, 2));
        // console.log("Type of result:", typeof result);
        // console.log("Type of result.balance:", typeof result.balance);
        // console.log(Object.prototype.hasOwnProperty.call(result, 'balance'));
        // for (const key in result) {
        //   console.log(key, result[key]);
        // }
        // let proto = Object.getPrototypeOf(result);
        // while (proto) {
        //   console.log(proto);
        //   proto = Object.getPrototypeOf(proto);
        // }
        const jsonResult = result.toJSON();
        // console.log(jsonResult);
        // console.log(jsonResult.balance);
        // console.log("Type of jsonResult.balance:", typeof jsonResult.balance);



        if (jsonResult && jsonResult.balance !== undefined) { // Check if balance is not undefined
          // const humanReadableBalance = (typeof result.balance.toHuman === 'function')
          //   ? result.balance.toHuman()
          //   : result.balance.toString(); // If toHuman isn't available, just convert the balance to string

          setBalance(jsonResult.balance);
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

  useEffect(() => {
    const fetchTokenNameAndSymbol = async () => {
      if (!api) return; // Ensure the API is set before fetching

      const assetId = 0;

      try {
        const result = await api.query.assets.metadata(assetId);
        console.log("Full result:", JSON.stringify(result, null, 2));

        const jsonResult = result.toJSON();

        if (jsonResult && jsonResult.name !== undefined) {
          const tokenName = hexToString(jsonResult.name);
          setTokenName(tokenName);
        } else {
          console.warn(
            "Unable to retrieve the 'token name' or the result is unexpected."
          );
        }

        if (jsonResult && jsonResult.symbol !== undefined) {
          const tokenSymbol = hexToString(jsonResult.symbol);
          setTokenSymbol(tokenSymbol);
        } else {
          console.warn(
            "Unable to retrieve the 'token symbol' or the result is unexpected."
          );
        }

      } catch (error) {
        console.error("Error fetching toke symbol:", error);
      }
    };

    fetchTokenNameAndSymbol();
  }, [api]);

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
            tokenLogo="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png"
            tokenName={tokenName}
            tokensymbol={tokenSymbol}
          />
        </Box>
        <Box>
          <Body balance={balance} tokensymbol={tokenSymbol} />
        </Box>
      </Box>
    </Card>
  );
}

export default BalanceCard;
