// frontend/src/components/SearchForm.jsx

import React, { useState } from 'react';

function SearchForm({ onSearch }) {
    // State to hold all form inputs
    const [formData, setFormData] = useState({
        city: '',
        check_in: '', 
        check_out: '', 
        guests: 1,
    });

    // Handles changes in all input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.check_in || !formData.check_out) {
            alert("Please select both check-in and check-out dates.");
            return;
        }

        // Call the search function passed from the parent page
        onSearch(formData);
    };

    return (
        <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                
                {/* Destination Input */}
                <div>
                    <label htmlFor="city" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Destination</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g., London, Paris"
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    />
                </div>

                {/* Check-in Date Input */}
                <div>
                    <label htmlFor="check_in" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Check-in</label>
                    <input
                        type="date"
                        id="check_in"
                        name="check_in"
                        value={formData.check_in}
                        onChange={handleChange}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    />
                </div>

                {/* Check-out Date Input */}
                <div>
                    <label htmlFor="check_out" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Check-out</label>
                    <input
                        type="date"
                        id="check_out"
                        name="check_out"
                        value={formData.check_out}
                        onChange={handleChange}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        required
                    />
                </div>

                {/* Guests Input */}
                <div>
                    <label htmlFor="guests" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Guests</label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        min="1"
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                >
                    Search Hotels
                </button>
            </form>
        </div>
    );
}

export default SearchForm;