// frontend/src/components/HotelList.jsx (Updated)

import React from 'react';
import HotelCard from './HotelCard'; 
import RoomCard from './RoomCard'; // <<< New component for displaying search results

// Accepts 'hotels' (could be Hotel objects or Room objects) and a boolean flag
function HotelList({ hotels, isSearchResult }) { 
    if (!hotels || hotels.length === 0) {
        return null; // The parent HomePage handles the "No results" message
    }

    if (isSearchResult) {
        // If it's a search result, render the list of available rooms
        return (
            <div className="search-result-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
                {hotels.map((room) => (
                    // We need a specific RoomCard component for room search results
                    <RoomCard key={room.id} room={room} /> 
                ))}
            </div>
        );
    }

    // If it's the initial page load (list of all hotels), render general hotel cards
    return (
        <div className="hotel-list-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '20px 0' }}>
            {hotels.map((hotel) => (
                // We use the general HotelCard component
                <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
    );
}

export default HotelList;