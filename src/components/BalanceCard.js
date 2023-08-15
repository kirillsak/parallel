import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { ApiPromise, WsProvider } from "@polkadot/api";
import React, { useState, useEffect } from "react";

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

function Body({ balance, tokenAbbreviation }) {
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
          {tokenAbbreviation}
        </Typography>
      </Grid>
    </Grid>
  );
}

function BalanceCard(props) {
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
        console.log("Account result:", result);

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
            tokenName="Ethereum"
            tokenAbbreviation="ETH"
          />
        </Box>
        <Box>
          <Body balance={balance} tokenAbbreviation="ETH" />
        </Box>
      </Box>
    </Card>
  );
}

export default BalanceCard;
