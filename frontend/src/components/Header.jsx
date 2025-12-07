// frontend/src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import the Auth Context

function Header() {
    // 2. Use the useAuth hook to get user data and the logout function
    const { user, logoutUser } = useAuth(); 

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoLink}>
                    🏨 Hotel Bookings
                </Link>
            </div>
            
            <nav style={styles.nav}>
                <ul style={styles.navList}>
                    {/* Main Navigation Link */}
                    <li style={styles.navItem}>
                        <Link to="/" style={styles.navLink}>Home</Link>
                    </li>

                    {/* --- Conditional Links based on Login Status --- */}
                    {user ? ( // If the 'user' object is present (logged in)
                        <>
                            {/* Dashboard Link (Accessible to all logged-in users for now) */}
                            <li style={styles.navItem}>
                                <Link to="/dashboard" style={styles.navLink}>Manager Dashboard</Link>
                            </li>
                            
                            {/* Display Username */}
                            <li style={{...styles.navItem, color: '#ffc107', fontWeight: 'bold'}}>
                                Hello, {user}!
                            </li>
                            {/* Link to User Profile/Bookings (Future route) */}
                            <li style={styles.navItem}>
                                <Link to="/profile" style={styles.navLink}>My Bookings</Link>
                            </li>
                            {/* Logout Button */}
                            <li style={styles.navItem}>
                                <button onClick={logoutUser} style={styles.logoutButton}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : ( // If no user (logged out)
                        <>
                            <li style={styles.navItem}>
                                <Link to="/login" style={styles.navLink}>Login</Link>
                            </li>
                            <li style={styles.navItem}>
                                <Link to="/register" style={styles.navButton}>Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;

// --- Basic Inline Styling (Same as before) ---
const styles = {
    header: {
        backgroundColor: '#003366', 
        color: 'white',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    logo: {
        fontSize: '1.5em',
        fontWeight: 'bold',
    },
    logoLink: {
        color: 'white',
        textDecoration: 'none',
    },
    nav: {},
    navList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    navItem: {
        display: 'inline',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        padding: '5px 10px',
        transition: 'color 0.2s',
    },
    navButton: {
        backgroundColor: '#ffc107',
        color: '#333',
        padding: '8px 15px',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    },
    logoutButton: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid white',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    }
};