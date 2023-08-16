import React, { createRef } from 'react'
import {
  Dimmer,
  Loader,
  Grid,
  Message,
  //Sticky,
  Container,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { mainListItems } from './components/listItems';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import SupplyCard from './components/SupplyCard';

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'
import AuthComponent from './components/Authorisation.jsx'
import { UserProvider } from './components/UserContext'
import Interactor from './Interactor'
import BalancesSection from './components/BalancesSection'
import { Stack } from '@mui/material';
import TreasuryBalancesSection from './components/TreasuryBalancesSection';
import AdminsCard from './components/AdminsCard';
/*
import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'
*/

const drawerWidth = 160;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      backgroundColor: '#000000',
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(5),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(7.15),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#417034',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#171717',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#d3eaf3',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#d3eaf3',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#d3eaf3',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#FFFFFF',
    },
    background: {
      primary: '#000000',
    }
  },
  typography: {
    fontFamily: 'Helvetica Neue, Arial',
  }
});


function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <ThemeProvider theme={defaultTheme}>
      <div ref={contextRef}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open} sx={{ backgroundColor: '#000000', justifyContent: 'center' }}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
              // sx={{
              //   marginRight: '36px',
              //   ...(open && { display: 'none' }),
              // }}
              >
                <MenuIcon />
              </IconButton>
              <Container sx={{ width: '250px' }}>
                <Card sx={{ backgroundColor: '#171717', padding: '3px 50px 3px 50px', borderRadius: '50px', flexGrow: 1, alignItems: 'center' }}>
                  <Typography
                    component="h1"
                    variant="h5"
                    color="White"
                    noWrap
                    sx={{ flexGrow: 1, textAlign: 'center' }}
                    fontSize={'1.25rem'}
                  >
                    Dashboard
                  </Typography>
                </Card>
              </Container>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" sx={{ borderRadius: '50px' }}>Sign Up</Button>
                <Button variant="contained" sx={{ borderRadius: '50px' }}>Log In</Button>
              </Stack>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                px: [1],
              }}
            >
            </Toolbar>
            <Divider />
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
              {/* {secondaryListItems} */}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: '#000000',
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Interactor />
            <AuthComponent />
            <BalancesSection />
            <SupplyCard />
            <TreasuryBalancesSection />
            <AdminsCard />
          </Box>
        </Box>

        <DeveloperConsole />
      </div>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <UserProvider>
      <div style={{ backgroundColor: 'white', height: '100vh' }}>
        <SubstrateContextProvider>
          <Main />
        </SubstrateContextProvider>
      </div>
    </UserProvider>
  )
}
