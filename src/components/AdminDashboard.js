import React from 'react';
import CommunitySelector from './CommunitySelector';
import SupplyCard from './SupplyCard';
import TreasuryBalancesSection from './TreasuryBalancesSection';
import AdminsCard from './AdminsCard';

function AdminDashboard() {
    return (
        <div>
            <CommunitySelector />
            <SupplyCard assetId={0} />
            <TreasuryBalancesSection />
            <AdminsCard />
        </div>
    );
}

export default AdminDashboard;
