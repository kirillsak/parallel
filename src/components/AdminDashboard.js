import React from 'react';
import CommunitySelector from './CommunitySelector';
import SupplyCard from './SupplyCard';
import TreasuryBalancesSection from './TreasuryBalancesSection';
import AdminsCard from './AdminsCard';
import { useCommunity } from './CommunityContext';

function AdminDashboard() {
    const { selectedCommunity } = useCommunity();


    return (
        <>
            <CommunitySelector />
            {selectedCommunity && (
                <>
                    <SupplyCard assetId={selectedCommunity.id} />
                    <TreasuryBalancesSection communityFund={selectedCommunity.fund} />
                    <AdminsCard />
                </>
            )}
        </>
    );
}

export default AdminDashboard;
