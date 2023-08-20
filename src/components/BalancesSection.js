import { Box, Card, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import NativeBalanceCard from './NativeBalanceCard'
import BalanceCard from './BalanceCard'
import React, { useState, useEffect } from 'react'
import { useSubstrateState } from '../substrate-lib'
import { useUser } from './UserContext'

function BalancesSection() {
  const { loggedInUser, userDetails } = useUser()
  const { api, currentAccount } = useSubstrateState()
  const [assetIds, setAssetIds] = useState([]);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const fetchAssets = async () => {
      if (!api) return; // Ensure the API is set before fetching

      try {
        const allKeys = await api.query.assets.asset.keys();
        // console.log("all keys", JSON.stringify(allKeys, null, 2));
        const fetchedAssetIds = allKeys.map((key) => key.args[0].toNumber());
        // console.log("assetIds", fetchedAssetIds);

        let fetchedBalances = {};
        for (let assetId of fetchedAssetIds) {
          const result = await api.query.assets.account(assetId, currentAccount);
          const jsonResult = result.toJSON();
          // console.log("jsonResult Balance for", assetId, " is ", jsonResult);

          if (jsonResult && jsonResult.balance !== undefined) {
            fetchedBalances[assetId] = jsonResult.balance;
          } else {
            console.warn(
              "Unable to retrieve the 'free' balance or the result is unexpected."
            );
          }

        }

        setAssetIds(fetchedAssetIds);
        setBalances(fetchedBalances);

      } catch (error) {
        console.error("Error fetching Assets:", error);
      }

    };

    fetchAssets();
  }, [api, currentAccount]);

  useEffect(() => {
    if (loggedInUser) {
      console.log(userDetails);
    }
  }, [loggedInUser, userDetails]);


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
            {loggedInUser ? userDetails.firstName + " Balances" : 'Login to see Balance'}
          </Typography>
        </Box>
      </Card>
      <Box>
        <Grid container spacing={2}>
          <Grid item>
            <NativeBalanceCard />
          </Grid>
          {assetIds.map((assetId) => (
            balances[assetId] && balances[assetId] > 0 ? (
              <Grid item key={assetId}>
                <BalanceCard address={currentAccount} assetId={assetId} balance={balances[assetId]} />
              </Grid>
            ) : null
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}

export default BalancesSection
