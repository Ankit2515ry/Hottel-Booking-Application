// frontend/src/components/HotelCard.jsx (NEW FILE)

import React from 'react';
import { Link } from 'react-router-dom';

function HotelCard({ hotel }) {
    const formatPrice = (price) => {
        if (price === null || price === undefined) return 'Price N/A';
        return new Intl.NumberFormat('en-IN', { // Use 'en-IN' locale for India
            style: 'currency',
            currency: 'INR', // Change currency code to Indian Rupee
        }).format(price);
    };

    // Calculate the lowest price among all rooms in the hotel
    const minPrice = hotel.rooms && hotel.rooms.length > 0
        ? Math.min(...hotel.rooms.map(room => parseFloat(room.price_per_night)))
        : null;

    return (
        <div style={styles.card}>
            <div style={styles.imageContainer}>
                {hotel.main_image ? (
                    <img 
                        src={hotel.main_image} // CRITICAL: Use the property directly
                        alt={`Image of ${hotel.name}`} 
                        style={styles.image} // Ensure you have styles to make the image visible
                    />
                ) : (
                    <div style={styles.imagePlaceholder}>
                        <p>No Image Available</p>
                    </div>
                )}
            </div>
            <div style={styles.content}>
                <h3 style={styles.hotelName}>{hotel.name}</h3>
                <p style={styles.location}>{hotel.city}, {hotel.address}</p>
                <p style={styles.description}>{hotel.description.substring(0, 100)}...</p>
                
                <div style={styles.footer}>
                    {minPrice ? (
                        <p style={styles.price}>
                            From {formatPrice(minPrice)} / night
                        </p>
                    ) : (
                        <p style={styles.price}>No rooms available</p>
                    )}
                    
                    {/* Link to the detail page (where users can choose rooms) */}
                    <Link to={`/hotel/${hotel.id}`} style={styles.button}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;

// ... (Add the new styles object)
const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    imageContainer: {
        height: '200px',
        width: '100%',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Ensures the image covers the area without distortion
    },
    imagePlaceholder: {
        height: '200px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        padding: '15px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    hotelName: {
        margin: '0 0 5px 0',
        color: '#003366',
        fontSize: '1.5em',
    },
    location: {
        margin: '0 0 10px 0',
        fontSize: '0.9em',
        color: '#777',
    },
    description: {
        fontSize: '0.9em',
        color: '#555',
        flexGrow: 1,
        marginBottom: '15px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '10px',
    },
    price: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#28a745',
        margin: 0,
    },
    button: {
        backgroundColor: '#ff6600',
        color: 'white',
        padding: '8px 15px',
        textAlign: 'center',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    }
};