import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Shop from './components/Shop';
import ProductList from './components/Product/ProductList';
import ProductForm from './components/Product/ProductForm';
import ProductDetail from './components/Product/ProductDetail';

function Navigation() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }

        @keyframes gradientMove {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%;   }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes float {
          0%,100% { transform:translateY(0);   }
          50%     { transform:translateY(-6px); }
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.4rem 1.1rem;
          border-radius: 20px;
          border: 1.5px solid rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.12);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.28);
          border-color: white;
          transform: translateY(-1px);
        }
        .nav-link.active {
          background: white;
          color: #7c3aed;
          border-color: white;
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .card-hover:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 16px 40px rgba(0,0,0,0.14) !important;
        }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:#a855f7; border-radius:3px; }
      `}</style>

            <nav style={{
                background: isAdmin
                    ? 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)'
                    : 'linear-gradient(90deg,#ff6b6b,#feca57,#48dbfb,#ff9ff3,#54a0ff,#5f27cd)',
                backgroundSize: '300% 300%',
                animation: isAdmin ? 'none' : 'gradientMove 8s ease infinite',
                padding: '0 1.5rem',
                height: '52px',               // ← compact height
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <div style={{
                            width: '30px', height: '30px',
                            background: 'white',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem',
                            flexShrink: 0,
                        }}>
                            🌈
                        </div>
                        <span style={{
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '1.05rem',
                            textShadow: '0 1px 6px rgba(0,0,0,0.25)',
                            letterSpacing: '-0.2px',
                        }}>
              Rainbow Toys
            </span>
                    </Link>

                    {/* Links */}
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        {isAdmin ? (
                            <>
                                <Link to="/"                 className="nav-link">← Store</Link>
                                <Link to="/admin/products"   className={`nav-link ${location.pathname==='/admin/products'?'active':''}`}>Products</Link>
                                <Link to="/admin/add"        className={`nav-link ${location.pathname==='/admin/add'?'active':''}`}>+ Add</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/"     className={`nav-link ${location.pathname==='/'?'active':''}`}>Home</Link>
                                <Link to="/shop" className={`nav-link ${location.pathname==='/shop'?'active':''}`}>Shop</Link>
                                <Link to="/admin/products" className="nav-link">Admin</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

function App() {
    return (
        <Router>
            <div style={{ minHeight:'100vh', background:'#f5f3ff' }}>
                <Navigation />
                <Routes>
                    <Route path="/"                element={<Home />} />
                    <Route path="/shop"            element={<Shop />} />
                    <Route path="/product/:id"     element={<ProductDetail isClientView={true} />} />
                    <Route path="/admin/products"  element={<ProductList />} />
                    <Route path="/admin/add"       element={<ProductForm />} />
                    <Route path="/admin/edit/:id"  element={<ProductForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;