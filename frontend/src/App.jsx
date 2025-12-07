// frontend/src/App.jsx (Updated)

import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import HomePage from './pages/HomePage';
import HotelDetailPage from './pages/HotelDetailPage';

// Import the new components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import BookingPage from './pages/BookingPage';
import ProtectedRoute from './components/ProtectedRoute'; // <-- NEW IMPORT

import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  return (
    <> 
      <Header /> 
      
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} /> 

          {/* --- PROTECTED BOOKING ROUTE --- */}
          <Route 
                path="/booking/:roomId" 
                element={<ProtectedRoute><BookingPage /></ProtectedRoute>} 
            />
          
          {/* My Bookings/Profile Page */}
          {/* Note: If MyBookingsPage is wrapped internally, you might not need ProtectedRoute here */}
          <Route path="/profile" element={<MyBookingsPage />} />
          </Routes>
      </main>
    </>
  );
}

export default App;