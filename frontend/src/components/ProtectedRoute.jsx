// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    // Get the user state from the AuthContext
    const { user } = useAuth();

    // If a user is NOT logged in, redirect them to the /login page
    if (!user) {
        // Navigate component handles the redirection
        // We pass 'replace' to prevent the user from hitting the back button to skip login
        return <Navigate to="/login" replace />;
    }

    // If the user IS logged in, render the child component (the protected page)
    return children;
}

export default ProtectedRoute;