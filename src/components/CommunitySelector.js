import React from 'react'
import {
    useEffect,
    useState,
} from 'react';
import { useSubstrateState } from '../substrate-lib';
import { hexToString } from '@polkadot/util';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'


function CommunitySelector() {
    const { api } = useSubstrateState();
    const {
        currentAccount,
    } = useSubstrateState();
    const [communitiesInfo, setCommunitiesInfo] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const fetchCommunityAdmins = async () => {
            if (!api) return; // Ensure the API is set before fetching

            // console.log('All key pairs before keyring', JSON.stringify(keyring.getPairs()));

            try {

                const nextCommunityId = await api.query.communities.nextCommunityId();

                console.log("Next community ID:", nextCommunityId.toNumber());

                let communitiesInfo = [];

                for (let i = 0; i < nextCommunityId.toNumber(); i++) {
                    const isAdmin = await api.query.communities.admins(i, currentAccount);
                    if (isAdmin.isSome) {
                        const community = await api.query.communities.communities(i);
                        const jsonResult = community.toJSON();
                        communitiesInfo.push({
                            id: i,
                            name: hexToString(jsonResult.name)
                        });
                    }
                }

                console.log("Community IDs for admin:", JSON.stringify(communitiesInfo));
                setCommunitiesInfo(communitiesInfo);


            } catch (error) {
                console.error("Error fetching community admins (community selector):", error);
            }
        };

        fetchCommunityAdmins();
    }, [api, currentAccount]);



    return (
        <div>
            <Button aria-controls="community-menu" aria-haspopup="true" onClick={handleClick}>
                Select Community
            </Button>
            <Menu
                id="community-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {communitiesInfo.map(community => (
                    <MenuItem key={community.id} onClick={handleClose} sx={{ color: 'black' }}>
                        {community.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default CommunitySelector;