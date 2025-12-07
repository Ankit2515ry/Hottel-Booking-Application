// frontend/src/pages/HotelDetailPage.jsx

import React from 'react';
import { useParams } from 'react-router-dom';

function HotelDetailPage() {
    // ... (Your component logic and JSX content) ...
    return (
        <div>
            <h2>Hotel Detail for ID: {useParams().id}</h2>
            {/* ... Rest of the page content ... */}
        </div>
    );
}

// <<< THIS LINE IS CRITICAL >>>
export default HotelDetailPage; // Ensure your component is exported by default