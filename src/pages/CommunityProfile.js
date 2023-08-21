import React, { createRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { CommunityProvider, useCommunity } from '../components/CommunityContext';
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
import Card from '@mui/material/Card';
import { useState } from 'react';
// import {  } from './CommunityContext';


import { useSubstrateState } from '../substrate-lib'
import { DeveloperConsole } from '../substrate-lib/components'
import AuthComponent2 from '../components/NewAuthorisation';
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import NaturePeopleIcon from '@mui/icons-material/NaturePeople'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { Link } from "react-router-dom";

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
            main: '#FF0000',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#FF0000',
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
    },
    overrides: {
        MuiInputBase: {
            input: {
                color: 'black',
            },
        },
    },
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {  // This targets the `selected` state of ListItemButton
                        backgroundColor: '#171717', // This is just an example: semi-transparent red
                        // Add other styles here as needed
                    },
                },
            },
        },
    },
});

function Main() {
    const { communityId } = useParams();
    const { selectedCommunity, setSelectedCommunity, allCommunities } = useCommunity();
    const { apiState, apiError, keyringState } = useSubstrateState()
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        // This function fetches the community by its ID and updates the state.
        const fetchAndSetCommunity = async () => {
            // Find the community from the 'allCommunities' state by its ID.
            const community = allCommunities.find(com => com.id === communityId);

            // If the community is found and it's different from the currently selected one, update the state.
            if (community && (!selectedCommunity.id || selectedCommunity.id !== communityId)) {
                setSelectedCommunity(community);
            }
        };

        fetchAndSetCommunity();
    }, [communityId, selectedCommunity, allCommunities, setSelectedCommunity]);

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
        <div style={{ backgroundColor: 'white', height: '100vh' }}>
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
                                            Communities
                                        </Typography>
                                    </Card>
                                </Container>
                                <AuthComponent2 />
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
                                <Link to={`/`}>
                                    <ListItemButton >
                                        <ListItemIcon style={{ marginRight: '-16px' }}>
                                            <DashboardIcon style={{ color: 'white' }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard" />
                                    </ListItemButton>
                                </Link>
                                <ListItemButton>
                                    <ListItemIcon style={{ marginRight: '-16px' }}>
                                        <NewReleasesIcon style={{ color: 'white' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="New" />
                                </ListItemButton>
                                <ListItemButton selected={true} style={{ paddingRight: '-16px', borderRadius: '50px' }}>
                                    <ListItemIcon style={{ marginRight: '-16px' }}>
                                        <Diversity3Icon style={{ color: 'white' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Communities" />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon style={{ marginRight: '-16px' }}>
                                        <NaturePeopleIcon style={{ color: 'white' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="People" />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemIcon style={{ marginRight: '-16px' }}>
                                        <SwapHorizIcon style={{ color: 'white' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Transfer" />
                                </ListItemButton>
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
                            <div>
                                Profile for community: {communityId}
                                Community details: {JSON.stringify(selectedCommunity)}
                                {/* Render your community details here */}
                            </div>
                        </Box>
                    </Box>

                    <DeveloperConsole />
                </div>
            </ThemeProvider>

        </div>
    )

}

function CommunityProfile() {
    return (
        <CommunityProvider>
            <Main />
        </CommunityProvider>
    );
}

export default CommunityProfile;

