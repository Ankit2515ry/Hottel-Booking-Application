// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const { loginUser, loading } = useAuth();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        
        // Access form values using the name attribute
        const username = e.target.username.value;
        const password = e.target.password.value;
        
        const success = await loginUser(username, password);

        if (success) {
            navigate('/');
        } else {
            setLoginError("Login failed. Check your username and password.");
        }
    };

    return (
        <div style={styles.background}>
            <div style={styles.card}>
                <h2 style={styles.header}>Login to Your Account</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    {/* Error Display */}
                    {loginError && <p style={styles.error}>{loginError}</p>}
                    
                    {/* Username Input */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            required 
                            style={styles.input}
                            placeholder="Your username"
                        />
                    </div>

                    {/* Password Input */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required 
                            style={styles.input}
                            placeholder="Your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={styles.button}
                    >
                        {loading ? 'Logging In...' : 'Sign In'}
                    </button>
                </form>
                
                {/* Registration Link */}
                <p style={styles.registerLink}>
                    Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;

// --- STYLES ---

const styles = {
    background: {
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa', // Light background color
    },
    card: {
        maxWidth: '400px',
        width: '90%',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Soft shadow
    },
    header: {
        textAlign: 'center',
        color: '#003366', // Deep blue/corporate color
        marginBottom: '30px',
        fontSize: '1.8em',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
        fontSize: '0.95em',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '1em',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '14px',
        backgroundColor: '#ff6600', // Orange/accent color
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
        fontSize: '1em',
        transition: 'background-color 0.2s',
    },
    error: {
        color: '#d9534f', // Red error color
        textAlign: 'center',
        marginBottom: '20px',
        border: '1px solid #d9534f',
        backgroundColor: '#fdd',
        padding: '10px',
        borderRadius: '6px',
    },
    registerLink: {
        textAlign: 'center',
        marginTop: '25px',
        fontSize: '0.9em',
        color: '#555',
    },
    link: {
        color: '#003366',
        textDecoration: 'none',
        fontWeight: 'bold',
    }
};