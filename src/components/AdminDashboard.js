import React from 'react';
import CommunitySelector from './CommunitySelector';
import SupplyCard from './SupplyCard';
import TreasuryBalancesSection from './TreasuryBalancesSection';
import AdminsCard from './AdminsCard';
import { useState, useEffect } from 'react';
import { useSubstrateState } from '../substrate-lib';

function AdminDashboard() {
    const [communityFund, setCommunityFund] = useState('')
    const { api } = useSubstrateState()

    useEffect(() => {
        const fetchCommunityFund = async () => {
            if (!api) return; // Ensure the API is set before fetching

            const communityId = 0;

            try {
                const result = await api.query.communities.communities(communityId);
                const jsonResult = result.toJSON();

                if (jsonResult && jsonResult.fund !== undefined) { // Check if balance is not undefined
                    setCommunityFund(jsonResult.fund);
                    console.log("Community Fund: ", JSON.stringify(jsonResult.fund));
                } else {
                    console.warn(
                        "Unable to retrieve the 'free' balance or the result is unexpected. (communityFund)"
                    );

                }
            } catch (error) {
                console.error("Error fetching fund account:", error);
            }
        };

        fetchCommunityFund();
    }, [api]);


    return (
        <div>
            <CommunitySelector />
            <SupplyCard assetId={0} />
            <TreasuryBalancesSection communityFund={communityFund} />
            <AdminsCard />
        </div>
    );
}

export default AdminDashboard;
