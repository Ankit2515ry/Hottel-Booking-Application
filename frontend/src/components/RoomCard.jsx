// frontend/src/components/HotelCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function HotelCard({ room }) {
    // Helper function to format currency
    const formatPrice = (price) => {
        if (price === null || price === undefined) return 'Price N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', // Change to your preferred currency
        }).format(price);
    };

    return (
        <div style={styles.card}>
            {/* Image Placeholder */}
            <div style={styles.imagePlaceholder}>
                <p>Room/Hotel Image</p>
            </div>
            
            {/* Content Area */}
            <div style={styles.content}>
                
                {/* Hotel Name (from the custom field in the Django RoomSerializer) */}
                <h3 style={styles.hotelName}>
                    {room.hotel_name || 'Hotel Name'}
                </h3>
                
                {/* Room Details */}
                <p style={styles.roomType}>
                    **Room Type:** {room.room_type ? room.room_type.toUpperCase() : 'N/A'}
                </p>
                <p style={styles.detail}>
                    **Max Guests:** {room.max_guests}
                </p>
                
                {/* Price and Action */}
                <div style={styles.actionRow}>
                    <div style={styles.priceSection}>
                        <span style={styles.price}>
                            {formatPrice(room.price_per_night)}
                        </span>
                        <span style={styles.priceText}> / night</span>
                    </div>

                    {/* Link to the Booking Page. Uses the room ID from the API */}
                    <Link to={`/booking/${room.id}`} style={styles.button}>
                        Book This Room
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;

// Basic inline styling (use a separate CSS file for production styling)
const styles = {
    card: {
        display: 'flex',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s',
    },
    imagePlaceholder: {
        width: '30%',
        minHeight: '200px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9em',
        color: '#666',
    },
    content: {
        padding: '20px',
        width: '70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    hotelName: {
        margin: '0 0 10px 0',
        color: '#003366',
    },
    roomType: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    detail: {
        fontSize: '0.9em',
        color: '#555',
    },
    actionRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        borderTop: '1px dashed #eee',
        paddingTop: '10px',
    },
    priceSection: {
        lineHeight: 1,
    },
    price: {
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#28a745', // Green
        marginRight: '5px',
    },
    priceText: {
        fontSize: '0.9em',
        color: '#777',
    },
    button: {
        backgroundColor: '#ffc107',
        color: '#333',
        padding: '10px 15px',
        textAlign: 'center',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
    }
};