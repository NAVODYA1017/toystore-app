import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// User Management
import UserList from './features/user-management/UserList';
import UserForm from './features/user-management/UserForm';
import UserDetail from './features/user-management/UserDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Products
import Home from './components/Home';
import Shop from './components/Shop';
import ProductList from './components/Product/ProductList';
import ProductForm from './components/Product/ProductForm';
import ProductDetail from './components/Product/ProductDetail';

// Cart & Orders
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirm from './pages/OrderConfirm';
import OrderForm from './pages/OrderForm';
import OrderList from './pages/OrderList';

function App() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    return (
        <CartProvider>
            <Router>
                <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
                    <nav style={{
                        background: 'linear-gradient(90deg, #ffd6e7, #ffecb3, #d4f1c0, #c5e8f7, #dcc5f7)',
                        padding: '16px 32px', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        boxShadow: '0 2px 12px rgba(155,121,232,0.2)'
                    }}>
                        <span style={{ fontSize: '22px', fontWeight: '800', color: '#4a2d8f' }}>🧸 Toy Store</span>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Link to="/" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>Home</Link>
                            <Link to="/shop" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>Shop</Link>
                            <Link to="/products" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>Products</Link>
                            <Link to="/cart" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>🛒 Cart</Link>
                            <Link to="/orders" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>Orders</Link>
                            <Link to="/users" style={{ color: '#333', textDecoration: 'none', fontWeight: '700' }}>Admin</Link>
                            {loggedInUser ? (
                                <Link to="/profile" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: '700' }}>👤 {loggedInUser.name}</Link>
                            ) : (
                                <>
                                    <Link to="/login" style={{ color: '#c0368a', textDecoration: 'none', fontWeight: '700' }}>Login</Link>
                                    <Link to="/register" style={{ color: '#2563c0', textDecoration: 'none', fontWeight: '700' }}>Register</Link>
                                </>
                            )}
                        </div>
                    </nav>
                    <div style={{ padding: '32px' }}>
                        <Routes>
                            {/* Home & Shop */}
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />

                            {/* Products */}
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/products/new" element={<ProductForm />} />
                            <Route path="/products/edit/:id" element={<ProductForm />} />
                            <Route path="/products/:id" element={<ProductDetail />} />

                            {/* Cart */}
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order-confirm" element={<OrderConfirm />} />

                            {/* Orders */}
                            <Route path="/orders" element={<OrderList />} />
                            <Route path="/orders/new" element={<OrderForm />} />

                            {/* User Management */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/users" element={<UserList />} />
                            <Route path="/users/new" element={<UserForm />} />
                            <Route path="/users/edit/:id" element={<UserForm />} />
                            <Route path="/users/:id" element={<UserDetail />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;