import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { CartProvider } from './context/CartContext';

// ── Client pages ──────────────────────────────────────────────
import ClientLayout from './components/client/ClientLayout';
import HomePage from './components/client/HomePage';
import ShopPage from './components/client/ShopPage';
import ProductDetailPage from './components/client/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderList from './pages/OrderList.jsx';
import OrderConfirm from './pages/OrderConfirm';
import Profile from './pages/Profile';
import ReviewPage from './pages/ReviewPage';

// ── Admin pages ───────────────────────────────────────────────
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductList from './components/Product/ProductList';
import ProductForm from './components/Product/ProductForm';
import CategoryList from './components/category/CategoryList';
import CategoryForm from './components/category/CategoryForm';
import UserList from './features/user-management/UserList';
import UserForm from './features/user-management/UserForm';
import UserDetail from './features/user-management/UserDetail';
import AdminOrders from './components/admin/AdminOrders';
import AdminPayments from './components/admin/AdminPayments';

// ── Auth ──────────────────────────────────────────────────────
import Login from './pages/Login';
import Register from './pages/Register';

// ── Route Guards ──────────────────────────────────────────────
function RequireAuth({ children }) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function RequireAdmin({ children }) {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />;
    return children;
}

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                {/* ── Auth Routes ── */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ── Admin Routes (No transition wrappers here to keep admin snappy) ── */}
                <Route path="/admin" element={
                    <RequireAdmin><AdminLayout /></RequireAdmin>
                }>
                    <Route index                      element={<AdminDashboard />} />
                    <Route path="products"            element={<ProductList />} />
                    <Route path="products/new"        element={<ProductForm />} />
                    <Route path="products/edit/:id"   element={<ProductForm />} />
                    <Route path="categories"          element={<CategoryList />} />
                    <Route path="categories/new"      element={<CategoryForm />} />
                    <Route path="categories/edit/:id" element={<CategoryForm />} />
                    <Route path="users"               element={<UserList />} />
                    <Route path="users/new"           element={<UserForm />} />
                    <Route path="users/edit/:id"      element={<UserForm />} />
                    <Route path="users/:id"           element={<UserDetail />} />
                    <Route path="orders"              element={<AdminOrders />} />
                    <Route path="payments"            element={<AdminPayments />} />
                </Route>

                {/* ── Client Routes ── */}
                <Route path="/" element={<ClientLayout />}>
                    <Route index                  element={<PageTransition><HomePage /></PageTransition>} />
                    <Route path="shop"            element={<PageTransition><ShopPage /></PageTransition>} />
                    <Route path="product/:id"     element={<PageTransition><ProductDetailPage /></PageTransition>} />
                    <Route path="cart"            element={<RequireAuth><PageTransition><CartPage /></PageTransition></RequireAuth>} />
                    <Route path="checkout"        element={<RequireAuth><PageTransition><CheckoutPage /></PageTransition></RequireAuth>} />
                    <Route path="orders"          element={<RequireAuth><PageTransition><OrderList /></PageTransition></RequireAuth>} />
                    <Route path="orders/confirm"  element={<RequireAuth><PageTransition><OrderConfirm /></PageTransition></RequireAuth>} />
                    <Route path="profile"         element={<RequireAuth><PageTransition><Profile /></PageTransition></RequireAuth>} />
                    <Route path="review/:productId" element={<RequireAuth><PageTransition><ReviewPage /></PageTransition></RequireAuth>} />
                </Route>

            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <CartProvider>
                <AnimatedRoutes />
            </CartProvider>
        </Router>
    );
}

export default App;