import { Box, Card, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import NativeBalanceCard from './NativeBalanceCard'
import BalanceCard from './BalanceCard'
import React, { useState, useEffect } from 'react'
import { useSubstrateState } from '../substrate-lib'

import axios from 'axios'
import { useUser } from './UserContext'

function BalancesSection() {
  const [userAddress, setUserAddress] = useState('')
  const { loggedInUser } = useUser()
  const { api } = useSubstrateState()
  const [assetIds, setAssetIds] = useState([]);
  const [balances, setBalances] = useState({});


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
    const fetchAssets = async () => {
      if (!api) return; // Ensure the API is set before fetching

      try {
        const allKeys = await api.query.assets.asset.keys();
        console.log("all keys", JSON.stringify(allKeys, null, 2));
        const fetchedAssetIds = allKeys.map((key) => key.args[0].toNumber());
        console.log("assetIds", fetchedAssetIds);

        let fetchedBalances = {};
        for (let assetId of fetchedAssetIds) {
          const result = await api.query.assets.account(assetId, userAddress);
          const jsonResult = result.toJSON();
          console.log("jsonResult Balance for", assetId, " is ", jsonResult);

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
  }, [api, userAddress]);



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
            {loggedInUser
              ? "Balances"
              : 'Login to see Balance'}
          </Typography>
        </Box>
      </Card>
      <Box>
        <Grid container spacing={2}>
          <Grid item>
            <NativeBalanceCard address={userAddress} />
          </Grid>
          {assetIds.map((assetId) => (
            balances[assetId] && balances[assetId] > 0 ? (
              <Grid item key={assetId}>
                <BalanceCard address={userAddress} assetId={assetId} balance={balances[assetId]} />
              </Grid>
            ) : null
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}

export default BalancesSection
