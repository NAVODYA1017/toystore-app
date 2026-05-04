import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import ProductList from './components/Product/ProductList';
import ProductDetail from './components/Product/ProductDetail';
import ProductForm from './components/Product/ProductForm';
import './App.css';

function Navbar() {
  return (
      <nav className="navbar">
        <Link to="/products" className="navbar-brand">
          <span>🧸</span> ToyStore
        </Link>
        <Link to="/products/new" className="btn btn-primary" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
          + Add Product
        </Link>
      </nav>
  );
}

function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;