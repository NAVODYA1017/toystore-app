import { useNavigate } from 'react-router-dom';

const features = [
    { emoji:'🎨', title:'Colorful Collection', desc:'Vibrant toys for every child',   bg:'#fff7ed', border:'#fed7aa' },
    { emoji:'⭐', title:'Top Quality',         desc:'Safe & durable for all ages',     bg:'#eff6ff', border:'#bfdbfe' },
    { emoji:'🚚', title:'Fast Delivery',       desc:'Quick shipping to your door',     bg:'#f0fdf4', border:'#bbf7d0' },
    { emoji:'💝', title:'Gift Ready',          desc:'Perfect for any occasion',        bg:'#fdf4ff', border:'#e9d5ff' },
];

const categories = [
    { emoji:'🚗', name:'Cars',     bg:'#fff0f0', border:'#fca5a5' },
    { emoji:'🧸', name:'Plush',    bg:'#fff8e1', border:'#fde68a' },
    { emoji:'🎮', name:'Tech',     bg:'#f0fff4', border:'#6ee7b7' },
    { emoji:'🧩', name:'Puzzles',  bg:'#f3e8ff', border:'#d8b4fe' },
    { emoji:'🎨', name:'Crafts',   bg:'#eff6ff', border:'#93c5fd' },
    { emoji:'🏆', name:'Sports',   bg:'#fff7ed', border:'#fdba74' },
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ background:'#f5f3ff', minHeight:'100vh' }}>

            {/* ── Hero ── */}
            <div style={{
                background: 'linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f093fb 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientMove 8s ease infinite',
                padding: '3rem 1.5rem',          // ← reduced from 80px
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* blobs */}
                <div style={{
                    position:'absolute', top:'-40px', left:'-40px',
                    width:'180px', height:'180px',
                    background:'rgba(255,255,255,0.07)',
                    borderRadius:'50%', pointerEvents:'none',
                }}/>
                <div style={{
                    position:'absolute', bottom:'-50px', right:'-30px',
                    width:'220px', height:'220px',
                    background:'rgba(255,255,255,0.05)',
                    borderRadius:'50%', pointerEvents:'none',
                }}/>

                <div style={{ position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto' }}>
                    <div style={{
                        display:'inline-block',
                        background:'rgba(255,255,255,0.18)',
                        color:'white',
                        padding:'0.3rem 1rem',
                        borderRadius:'50px',
                        fontSize:'0.78rem',
                        fontWeight:'600',
                        marginBottom:'1rem',
                        border:'1px solid rgba(255,255,255,0.3)',
                    }}>
                        🎉 New Arrivals Every Week!
                    </div>

                    <h1 style={{
                        color:'white',
                        fontSize:'clamp(1.6rem,4vw,2.6rem)',  // ← smaller
                        fontWeight:'800',
                        lineHeight:'1.2',
                        marginBottom:'0.8rem',
                        textShadow:'0 3px 15px rgba(0,0,0,0.2)',
                    }}>
                        Welcome to Rainbow Toy Store
                    </h1>

                    <p style={{
                        color:'rgba(255,255,255,0.88)',
                        fontSize:'0.95rem',
                        lineHeight:'1.6',
                        marginBottom:'1.8rem',
                    }}>
                        Discover magical toys that bring joy and color to every child's life!
                    </p>

                    <div style={{ display:'flex', gap:'0.8rem', justifyContent:'center', flexWrap:'wrap' }}>
                        <button
                            onClick={() => navigate('/shop')}
                            style={{
                                background:'white',
                                color:'#7c3aed',
                                border:'none',
                                borderRadius:'50px',
                                padding:'0.75rem 2rem',
                                fontSize:'0.95rem',
                                fontWeight:'700',
                                cursor:'pointer',
                                transition:'all 0.2s ease',
                                boxShadow:'0 6px 20px rgba(0,0,0,0.18)',
                                animation:'float 3s ease-in-out infinite',
                            }}
                            onMouseOver={(e) => { e.target.style.transform='scale(1.05)'; }}
                            onMouseOut={(e)  => { e.target.style.transform='scale(1)';    }}
                        >
                            Start Shopping
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            style={{
                                background:'transparent',
                                color:'white',
                                border:'2px solid rgba(255,255,255,0.65)',
                                borderRadius:'50px',
                                padding:'0.75rem 1.6rem',
                                fontSize:'0.95rem',
                                fontWeight:'600',
                                cursor:'pointer',
                                transition:'all 0.2s ease',
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background='rgba(255,255,255,0.15)'; }}
                            onMouseOut={(e)  => { e.currentTarget.style.background='transparent';            }}
                        >
                            View All
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div style={{
                background:'white',
                boxShadow:'0 1px 10px rgba(0,0,0,0.07)',
                padding:'0.9rem 1.5rem',
            }}>
                <div style={{
                    maxWidth:'1200px', margin:'0 auto',
                    display:'grid',
                    gridTemplateColumns:'repeat(4,1fr)',
                    gap:'0.5rem',
                    textAlign:'center',
                }}>
                    {[
                        { value:'500+', label:'Products',        emoji:'🧸' },
                        { value:'10K+', label:'Happy Customers', emoji:'😊' },
                        { value:'4.9',  label:'Star Rating',     emoji:'⭐' },
                        { value:'FREE', label:'Shipping $50+',   emoji:'🚚' },
                    ].map((s,i) => (
                        <div key={i} style={{ padding:'0.3rem' }}>
                            <div style={{ fontSize:'1.2rem' }}>{s.emoji}</div>
                            <div style={{
                                fontSize:'1.1rem', fontWeight:'800',
                                background:'linear-gradient(135deg,#7c3aed,#a855f7)',
                                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                            }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize:'0.72rem', color:'#6b7280', fontWeight:'500' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.5rem 1.5rem' }}>

                {/* ── Categories ── */}
                <h2 style={{ fontSize:'1.1rem', fontWeight:'800', color:'#1f2937', marginBottom:'0.9rem' }}>
                    Shop by Category
                </h2>
                <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(6,1fr)',
                    gap:'0.8rem',
                    marginBottom:'1.8rem',
                }}>
                    {categories.map((c,i) => (
                        <div
                            key={i}
                            onClick={() => navigate('/shop')}
                            className="card-hover"
                            style={{
                                background:c.bg,
                                border:`1.5px solid ${c.border}`,
                                borderRadius:'12px',
                                padding:'1rem 0.5rem',
                                textAlign:'center',
                                cursor:'pointer',
                                animation:`fadeInUp 0.4s ease ${i*0.07}s backwards`,
                            }}
                        >
                            <div style={{ fontSize:'1.8rem', marginBottom:'0.4rem' }}>{c.emoji}</div>
                            <div style={{ fontSize:'0.72rem', fontWeight:'700', color:'#374151' }}>{c.name}</div>
                        </div>
                    ))}
                </div>

                {/* ── Why Us ── */}
                <h2 style={{ fontSize:'1.1rem', fontWeight:'800', color:'#1f2937', marginBottom:'0.9rem' }}>
                    Why Choose Us?
                </h2>
                <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
                    gap:'1rem',
                    paddingBottom:'2rem',
                }}>
                    {features.map((f,i) => (
                        <div
                            key={i}
                            className="card-hover"
                            style={{
                                background:'white',
                                borderRadius:'14px',
                                overflow:'hidden',
                                boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
                                animation:`fadeInUp 0.4s ease ${i*0.1}s backwards`,
                            }}
                        >
                            <div style={{
                                background:f.bg,
                                padding:'1.2rem',
                                fontSize:'2rem',
                                textAlign:'center',
                                borderBottom:`2px solid ${f.border}`,
                            }}>
                                {f.emoji}
                            </div>
                            <div style={{ padding:'0.9rem' }}>
                                <h3 style={{ fontSize:'0.88rem', fontWeight:'700', color:'#1f2937', marginBottom:'0.3rem' }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontSize:'0.78rem', color:'#6b7280', lineHeight:'1.5' }}>
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
