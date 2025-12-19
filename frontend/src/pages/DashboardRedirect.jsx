import React from 'react';
import { useAuth } from '../context/AuthContext';
import HotelDashboardPage from './HotelDashboardPage'; 
import MyBookingsPage from './MyBookingsPage';

function DashboardRedirect() {
    // Ensure these are being destructured correctly from your context
    const { isManager, loading } = useAuth();

    // If loading is undefined in your context, this could cause issues.
    // We add a fallback check here.
    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Loading your dashboard...</div>;
    }

    return isManager ? <HotelDashboardPage /> : <MyBookingsPage />;
}

export default DashboardRedirect;