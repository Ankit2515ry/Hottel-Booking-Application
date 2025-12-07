// frontend/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const { registerUser, loading } = useAuth();
    const navigate = useNavigate();
    const [regErrors, setRegErrors] = useState({});
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegErrors({});
        setMessage(null);

        // Access form values using the name attribute (e.g., e.target.username.value)
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const password2 = e.target.password2.value;

        const result = await registerUser(username, email, password, password2);

        if (result.success) {
            setMessage(result.message);
            // Redirect to login after successful registration
            setTimeout(() => navigate('/login'), 2000); 
        } else {
            // Handle specific errors returned from the Django serializer (e.g., username already exists)
            setRegErrors(result.errors);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Create an Account</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                
                {message && <p style={styles.success}>{message}</p>}
                
                {/* 1. Username Input */}
                <div style={styles.inputGroup}>
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" // CRITICAL: This enables e.target.username.value
                        required 
                        style={styles.input} 
                    />
                    {regErrors.username && <p style={styles.error}>{regErrors.username[0]}</p>}
                </div>

                {/* 2. Email Input */}
                <div style={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" // CRITICAL: Enables e.target.email.value
                        required 
                        style={styles.input} 
                    />
                    {regErrors.email && <p style={styles.error}>{regErrors.email[0]}</p>}
                </div>

                {/* 3. Password Input */}
                <div style={styles.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" // CRITICAL: Enables e.target.password.value
                        required 
                        style={styles.input} 
                    />
                </div>

                {/* 4. Confirm Password Input */}
                <div style={styles.inputGroup}>
                    <label htmlFor="password2">Confirm Password</label>
                    <input 
                        type="password" 
                        id="password2" 
                        name="password2" // CRITICAL: Enables e.target.password2.value
                        required 
                        style={styles.input} 
                    />
                    {/* Django often returns the non-matching error on the 'password' key */}
                    {regErrors.password && <p style={styles.error}>{regErrors.password[0]}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Processing...' : 'Register'}
                </button>
            </form>
            
            <p style={styles.loginLink}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default RegisterPage;

// --- Basic Inline Styling (Can be moved to a CSS file later) ---
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
    },
    header: {
        textAlign: 'center',
        color: '#003366',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginTop: '5px',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px',
        backgroundColor: '#ff6600',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    error: {
        color: 'red',
        fontSize: '0.9em',
        marginTop: '5px',
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: '15px',
        border: '1px solid green',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#d4edda',
    },
    loginLink: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '0.9em',
    }
};