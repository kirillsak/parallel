import { Box, Card, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import NativeBalanceCard from './NativeBalanceCard'
import BalanceCard from './BalanceCard'
import React, { useState, useEffect } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'

// import axios from 'axios'
// import { useUser } from './UserContext'

function TreasuryBalancesSection() {
  const [communityFund, setCommunityFund] = useState('')
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
    const fetchCommunityFund = async () => {
      if (!api) return; // Ensure the API is set before fetching

      const communityId = 0;

      try {
        const result = await api.query.communities.communities(communityId);
        // console.log(result);
        // console.log("Community Full result:", JSON.stringify(result, null, 2));
        const jsonResult = result.toJSON();
        // console.log(jsonResult);
        // console.log(jsonResult.fund);
        // console.log("Type of jsonResult.fund:", typeof jsonResult.fund);

        if (jsonResult && jsonResult.fund !== undefined) { // Check if balance is not undefined
          // const humanReadableBalance = (typeof result.balance.toHuman === 'function')
          //   ? result.balance.toHuman()
          //   : result.balance.toString(); // If toHuman isn't available, just convert the balance to string

          setCommunityFund(jsonResult.fund);
        } else {
          console.warn(
            "Unable to retrieve the 'free' balance or the result is unexpected."
          );

        }
      } catch (error) {
        console.error("Error fetching fund account:", error);
      }
    };

    fetchCommunityFund();
  }, [api]);

  return (
    <Stack spacing={2} padding={1} direction="row">
      <Card
        sx={{
          backgroundColor: '#BED7A8',
          padding: '5px 15px 5px 15px',
          borderRadius: '25px',
          minWidth: '170px',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ height: '100%' }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: '2rem', color: 'black' }}
          >
            Community Fund Balances
          </Typography>
        </Box>
      </Card>
      <Box>
        <Grid container spacing={2}>
          <Grid item>
            <NativeBalanceCard address={communityFund} />
          </Grid>
          <Grid item>
            <BalanceCard address={communityFund} />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  )
}

export default TreasuryBalancesSection
