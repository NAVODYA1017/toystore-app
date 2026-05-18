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
      <div className="app-header">
        <div className="app-header__icon">★</div>
        <div>
          <h1 className="app-header__title">Reviews &amp; Ratings</h1>
          <p className="app-header__sub">Toystore — feature/review-and-rating</p>
        </div>
      </div>

      <ReviewForm onSave={handleSave} editReview={editReview} />
      <ReviewList key={refresh} onEdit={setEditReview} />
    </div>
  );
}

export default App;
