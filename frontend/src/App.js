import React, { useState } from 'react';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import './App.css';

function App() {
    const [refresh, setRefresh] = useState(false);
    const [editReview, setEditReview] = useState(null);

    const handleSave = () => {
        setRefresh(!refresh);
        setEditReview(null);
    };

    return (
        <div className="App">
            {/* Updated Rainbow Header */}
            <div className="app-header-rainbow">
                <div className="app-header__group">
                    <div className="app-header__icon">🧸</div>
                    <div>
                        <h1 className="app-header__title">ToyStore Reviews</h1>
                        <p className="app-header__sub">Customer Ratings & Feedback</p>
                    </div>
                </div>
                <div>
                    <div className="nav-pill">⭐ All Reviews</div>
                </div>
            </div>

            <div style={{ padding: '0 1.5rem' }}>
                <ReviewForm onSave={handleSave} editReview={editReview} />
                <ReviewList key={refresh} onEdit={setEditReview} />
            </div>
        </div>
    );
}

export default App;