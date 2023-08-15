import { Box, Card, Grid, Stack } from '@mui/material'
import Typography from '@mui/material/Typography'
import BalanceCard from './BalanceCard'
import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useUser } from './UserContext'

function BalancesSection() {
  const [userAddress, setUserAddress] = useState('')
  const { loggedInUser } = useUser()

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

  return (
    <Stack spacing={2} padding={1} direction="row">
      <Card
        sx={{
          backgroundColor: 'white',
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
              ? loggedInUser + "'s balances"
              : 'Login to see Balance'}
          </Typography>
        </Box>
      </Card>
      <Box>
        <Grid container spacing={2}>
          <Grid item>
            <BalanceCard address={userAddress} />
          </Grid>
          <Grid item>
            <BalanceCard address="5Ddp6n9jhVnLFf54ahWENTNZregypej8Zy18a4PtJs1iQsXy" />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  )
}

export default BalancesSection
