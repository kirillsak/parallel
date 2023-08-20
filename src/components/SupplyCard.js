import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { useSubstrateState } from "../substrate-lib";
import { hexToString } from "@polkadot/util";

function Header({ tokenLogo, tokenName }) {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: "2.5rem" }}>
          Token Supply
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "center",
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
    </Box>
  );
}

function Body({ supply, tokenAbbreviation }) {
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"center"}
      alignItems={"baseline"}
    >
      <Grid item sx={{ marginLeft: 5, }}>
        <Typography variant="h4" component="h3" sx={{ fontSize: "3rem" }}>
          {supply}
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

function SupplyCard({ assetId }) { // assumes that assetId and communityId are the same
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [supply, setSupply] = useState(null);
  const { api } = useSubstrateState()

  useEffect(() => {
    const fetchTokenNameAndSymbol = async () => {
      if (!api) return; // Ensure the API is set before fetching

      try {
        const result = await api.query.assets.metadata(assetId);
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
        console.error("Error fetching token symbol:", error);
      }
    };

    fetchTokenNameAndSymbol();
  }, [api, assetId]);

  useEffect(() => {
    const fetchSupply = async () => {
      if (!api) return; // Ensure the API is set before fetching

      try {
        const result = await api.query.assets.asset(assetId);
        const jsonResult = result.toJSON();


        if (jsonResult && jsonResult.supply !== undefined) { // Check if Supply is not undefined
          setSupply(jsonResult.supply);
        } else {
          console.warn(
            "Unable to retrieve the 'free' balance or the result is unexpected. (supplyCard)"
          );

        }
      } catch (error) {
        console.error("Error fetching account balance: (supplyCard)", error);
      }
    };

    fetchSupply();
  }, [api, assetId]);

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
            tokenAbbreviation={tokenSymbol}
          />
        </Box>
        <Box>
          <Body supply={supply} tokenAbbreviation={tokenSymbol} />
        </Box>
      </Box>
    </Card>
  );
}

export default SupplyCard;
