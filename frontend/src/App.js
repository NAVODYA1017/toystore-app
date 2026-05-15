import React, { useState } from 'react';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [editReview, setEditReview] = useState(null);

  return (
      <div className="App">
        <h1>⭐ Reviews & Ratings</h1>
      </div>
  );
}
export default App;