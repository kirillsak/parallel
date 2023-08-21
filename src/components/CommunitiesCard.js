import React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import ListItemText from "@mui/material/ListItemText";
// import Stack from "@mui/material/Stack";
import { useCommunity } from "./CommunityContext";
import { hexToString } from '@polkadot/util';
import { Link } from "react-router-dom";



function CommunitiesCard() {

    const { allCommunities } = useCommunity();

    return (
        <Card sx={{ backgroundColor: "#171717", borderRadius: "30px" }}>
            <Box
                paddingTop={2}
                paddingBottom={2}
                paddingLeft={3}
                paddingRight={3}
                minWidth={290}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                >
                    <Typography variant="h1" component="h1" sx={{ fontSize: "2.5rem" }}>
                        Communities
                    </Typography>
                </Box>
                <Divider sx={{ backgroundColor: "#2F2F2F", margin: 2 }} />
                <List>
                    {allCommunities.map((community, index) => (
                        <Link to={`/community/${community.id}`}>
                            <ListItemButton key={community.id} sx={{ borderRadius: '50px' }}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={hexToString(community.name)} />
                            </ListItemButton>
                        </Link>
                    ))}
                </List>
            </Box>

        </Card>
    );
}

export default CommunitiesCard;
