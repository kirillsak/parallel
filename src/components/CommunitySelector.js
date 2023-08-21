import React from 'react'
import {
    useEffect,
    useState,
} from 'react';
import { useSubstrateState } from '../substrate-lib';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useCommunity } from './CommunityContext';
import { hexToString } from '@polkadot/util';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



function CommunitySelector() {
    const { api } = useSubstrateState();
    const {
        currentAccount,
    } = useSubstrateState();
    const [adminCommunities, setAdminCommunities] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const { selectedCommunity, setSelectedCommunity, allCommunities } = useCommunity();



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (community) => {
        setSelectedCommunity(community);
        handleClose();
    };


    useEffect(() => {
        const fetchAdminCommunities = async () => {
            if (!api || !allCommunities.length) return;

            try {
                let communitiesInfo = [];

                for (let community of allCommunities) {
                    const isAdmin = await api.query.communities.admins(community.id, currentAccount);
                    if (isAdmin.isSome) {
                        communitiesInfo.push(community);
                    }
                }

                console.log("Community IDs for admin:", JSON.stringify(communitiesInfo));
                setAdminCommunities(communitiesInfo);
            } catch (error) {
                console.error("Error fetching communities for admin:", error);
            }
        };

        fetchAdminCommunities();
    }, [api, currentAccount, allCommunities]);



    return (
        <div>
            {adminCommunities.length === 0 ? (
                <p>You are not an admin in any communities.</p>
            ) : (
                <>
                    <Button
                        variant="outlined"
                        aria-controls="community-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        endIcon={<ArrowDropDownIcon />}
                    >
                        {selectedCommunity && selectedCommunity.name ? hexToString(selectedCommunity.name) : "Select Community"}
                    </Button>
                    <Menu
                        id="community-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {adminCommunities.map(community => (
                            <MenuItem
                                key={community.id}
                                onClick={() => handleMenuItemClick(community)}
                                sx={{ color: 'black' }}
                            >
                                {hexToString(community.name)}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
        </div>
    );
}

export default CommunitySelector;