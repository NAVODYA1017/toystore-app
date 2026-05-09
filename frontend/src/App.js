import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import OrderList from './pages/OrderList';
import OrderForm from './pages/OrderForm';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <nav className="navbar">
                    <h1 className="logo">🧸 ToyStore Orders</h1>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">📋 Order List</Link>
                        <Link to="/create" className="nav-link">➕ Create Order</Link>
                    </div>
                </nav>
                <div className="content">
                    <Routes>
                        <Route path="/" element={<OrderList />} />
                        <Route path="/create" element={<OrderForm />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;