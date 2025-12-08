// frontend/src/pages/HotelDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const BASE_URL = 'http://127.0.0.1:8000/api/';

// Component to handle adding a new room
const AddRoomForm = ({ hotelId, authTokens, onRoomAdded }) => {
    const [formData, setFormData] = useState({
        room_type: '',
        price_per_night: '',
        max_guests: '',
        total_rooms: '',
        hotel: hotelId // Automatically link the room to the hotel
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const payload = {
                ...formData,
                price_per_night: parseFloat(formData.price_per_night),
                max_guests: parseInt(formData.max_guests),
                total_rooms: parseInt(formData.total_rooms),
            };

            const response = await axios.post(`${BASE_URL}rooms/`, payload, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setMessage(`Room type "${payload.room_type}" added successfully!`);
                onRoomAdded(); // Trigger refresh on parent
                // Reset form fields
                setFormData({
                    room_type: '',
                    price_per_night: '',
                    max_guests: '',
                    total_rooms: '',
                    hotel: hotelId
                });
            }
        } catch (error) {
            console.error("Failed to add room:", error.response?.data);
            setMessage(`Error: ${JSON.stringify(error.response?.data || error.message)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formHeader}>Add New Room Type</h3>
            {message && <p style={message.startsWith('Error') ? styles.errorMessage : styles.successMessage}>{message}</p>}
            
            <select name="room_type" value={formData.room_type} onChange={handleChange} placeholder="Room Type (e.g., Deluxe, Suite)" required style={styles.input} > 
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
            </select>
            <input name="price_per_night" value={formData.price_per_night} onChange={handleChange} placeholder="Price per Night" type="number" step="0.01" required style={styles.input} />
            <input name="max_guests" value={formData.max_guests} onChange={handleChange} placeholder="Max Guests" type="number" required style={styles.input} />
            <input name="total_rooms" value={formData.total_rooms} onChange={handleChange} placeholder="Total Rooms of this Type" type="number" required style={styles.input} />
            
            <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Adding...' : 'Save Room Type'}
            </button>
        </form>
    );
};


function HotelDashboardPage() {
    const { authTokens, user } = useAuth();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State to force re-fetch of rooms after a new room is added
    const [refreshRooms, setRefreshRooms] = useState(0);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // CRITICAL: We need an endpoint that fetches the hotel managed by the user.
            // Assuming we use a dedicated action/viewset method on the backend, e.g., /api/hotels/my_hotel/
            // For now, we'll try to fetch all hotels and rely on Django to filter.
            const hotelResponse = await axios.get(`${BASE_URL}hotels/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` }
            });

            // Assuming the backend returns only the hotel managed by the user (or an empty array)
            const managedHotel = hotelResponse.data[0]; 

            if (managedHotel) {
                setHotel(managedHotel);
                setRooms(managedHotel.rooms); // Rooms are nested in the HotelSerializer
            } else {
                setError("You are not currently assigned to manage any hotel.");
                setHotel(null);
                setRooms([]);
            }
        } catch (err) {
            console.error("Dashboard data fetch failed:", err);
            setError("Failed to load dashboard data. Ensure your user is linked to a hotel.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [authTokens, refreshRooms]); 
    // refreshRooms dependency ensures data is re-fetched after adding a room

    if (loading) return <div style={styles.loading}>Loading Hotel Dashboard...</div>;
    if (error) return <div style={styles.errorContainer}>{error}</div>;
    if (!hotel) return <div style={styles.errorContainer}>You are not managing a hotel.</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.mainHeader}>🏨 Dashboard for {hotel.name}</h1>
            <p style={styles.hotelInfo}>Location: {hotel.city}, {hotel.address}</p>

            <div style={styles.contentGrid}>
                
                {/* 1. Add Room Form */}
                <div style={styles.section}>
                    <AddRoomForm 
                        hotelId={hotel.id} 
                        authTokens={authTokens} 
                        onRoomAdded={() => setRefreshRooms(prev => prev + 1)} // Increment state to trigger re-fetch
                    />
                </div>

                {/* 2. Existing Rooms List */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeader}>Existing Room Types ({rooms.length})</h3>
                    <div style={styles.roomList}>
                        {rooms.length === 0 ? (
                            <p>No room types currently defined for this hotel.</p>
                        ) : (
                            rooms.map((room) => (
                                <div key={room.id} style={styles.roomCard}>
                                    <h4>{room.room_type}</h4>
                                    <p>Price: ₹{parseFloat(room.price_per_night).toFixed(2)}</p>
                                    <p>Max Guests: {room.max_guests}</p>
                                    <p>Available Units: {room.total_rooms}</p>
                                    {/* Edit/Delete actions would go here */}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrap the dashboard in the ProtectedRoute component
const ProtectedHotelDashboardPage = (props) => (
    <ProtectedRoute>
        <HotelDashboardPage {...props} />
    </ProtectedRoute>
);

export default ProtectedHotelDashboardPage;


// --- Basic Inline Styling ---
const styles = {
    container: { maxWidth: '1000px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
    mainHeader: { color: '#003366', borderBottom: '2px solid #ff6600', paddingBottom: '10px', marginBottom: '10px' },
    hotelInfo: { color: '#777', marginBottom: '30px' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '1.2em' },
    errorContainer: { textAlign: 'center', color: '#d9534f', border: '1px solid #d9534f', padding: '20px', backgroundColor: '#fdd', borderRadius: '8px' },
    contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    section: { padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    sectionHeader: { color: '#ff6600', marginBottom: '15px', borderBottom: '1px dashed #ddd', paddingBottom: '5px' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    formHeader: { color: '#003366', marginBottom: '15px' },
    input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px' },
    button: { padding: '10px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    errorMessage: { color: '#d9534f', backgroundColor: '#fdd', padding: '10px', borderRadius: '4px' },
    successMessage: { color: '#28a745', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px' },
    roomList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    roomCard: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'white' },
};