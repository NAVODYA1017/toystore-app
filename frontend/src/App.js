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
        <h1>⭐ Reviews & Ratings</h1>
        <ReviewForm onSave={handleSave} editReview={editReview} />
        <ReviewList key={refresh} onEdit={setEditReview} />
      </div>
  );
}
export default App;