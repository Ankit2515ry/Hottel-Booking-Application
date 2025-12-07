// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const BASE_URL = 'http://127.0.0.1:8000/api/';

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    // Initialize state from local storage (to persist login across refresh)
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')) 
            : null
    );
    // User is stored as a username string
    const [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')).user 
            : null
    );
    const [loading, setLoading] = useState(false);

    // --- 1. Login Function (Talks to Django: /api/token/) ---
    const loginUser = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}token/`, {
                username,
                password
            });
            
            if (response.status === 200) {
                const data = response.data;
                data.user = username; // Attach username for easy context access

                setAuthTokens(data);
                setUser(username);
                localStorage.setItem('authTokens', JSON.stringify(data));
                
                setLoading(false);
                return true; // Success
            }
        } catch (error) {
            setLoading(false);
            console.error("Login failed:", error.response?.data);
            // Returning false or null on failure is critical for error handling on the page
            return false; 
        }
    };

    // --- 2. Logout Function ---
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login'); // Redirect to login after successful logout
    };
    
    // --- 3. Registration Function (Talks to Django: /api/register/) ---
    const registerUser = async (username, email, password, password2) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}register/`, {
                username,
                email,
                password,
                password2
            });
            
            setLoading(false);
            if (response.status === 201) {
                return { success: true, message: "Registration successful. Please login." };
            }
        } catch (error) {
            setLoading(false);
            // Return errors from Django for display on the Register page
            return { success: false, errors: error.response?.data };
        }
    }

    const contextData = {
        user,
        authTokens,
        loading,
        loginUser,
        logoutUser,
        registerUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};