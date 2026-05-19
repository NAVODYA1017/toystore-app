import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../features/user-management/userService';

const styles = `
@keyframes nvl-bgShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes nvl-floatToy {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-18px) rotate(5deg); }
  66%       { transform: translateY(-8px) rotate(-4deg); }
}
@keyframes nvl-cardIn {
  from { opacity: 0; transform: translateY(40px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0px) scale(1); }
}
@keyframes nvl-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nvl-starSpin {
  0%   { transform: rotate(0deg) scale(1);   opacity: 0.6; }
  50%  { transform: rotate(180deg) scale(1.3); opacity: 1; }
  100% { transform: rotate(360deg) scale(1);  opacity: 0.6; }
}
@keyframes nvl-orbitA {
  from { transform: rotate(0deg)   translateX(120px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
}
@keyframes nvl-orbitB {
  from { transform: rotate(120deg)  translateX(160px) rotate(-120deg); }
  to   { transform: rotate(480deg)  translateX(160px) rotate(-480deg); }
}
@keyframes nvl-orbitC {
  from { transform: rotate(240deg)  translateX(200px) rotate(-240deg); }
  to   { transform: rotate(600deg)  translateX(200px) rotate(-600deg); }
}
@keyframes nvl-pulse {
  0%, 100% { box-shadow: 0 4px 18px rgba(155,121,232,0.45); }
  50%       { box-shadow: 0 6px 28px rgba(155,121,232,0.75); }
}
@keyframes nvl-inputFocus {
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
}
@keyframes nvl-shake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-8px); }
  40%     { transform: translateX(8px); }
  60%     { transform: translateX(-5px); }
  80%     { transform: translateX(5px); }
}

.nvl-bg {
  min-height: 100vh;
  background: linear-gradient(270deg, #667eea, #764ba2, #a78bfa, #7c3aed, #6366f1);
  background-size: 300% 300%;
  animation: nvl-bgShift 8s ease infinite;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; position: relative; overflow: hidden;
}
.nvl-orbit-container {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none; z-index: 0;
}
.nvl-orbit-toy {
  position: absolute; top: 0; left: 0;
  font-size: 28px; margin-left: -14px; margin-top: -14px;
}
.nvl-orbit-a { animation: nvl-orbitA 12s linear infinite; }
.nvl-orbit-b { animation: nvl-orbitB 16s linear infinite; }
.nvl-orbit-c { animation: nvl-orbitC 20s linear infinite; }

.nvl-star {
  position: absolute; font-size: 18px;
  animation: nvl-starSpin 4s ease-in-out infinite;
  opacity: 0.7; pointer-events: none;
}
.nvl-card {
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  border-radius: 24px; padding: 48px 40px;
  width: 100%; max-width: 420px;
  box-shadow: 0 8px 40px rgba(100,60,200,0.3);
  border: 1.5px solid rgba(255,255,255,0.85);
  animation: nvl-cardIn 0.7s cubic-bezier(.22,1,.36,1) both;
}
.nvl-emoji {
  font-size: 56px; display: block; text-align: center;
  animation: nvl-floatToy 4s ease-in-out infinite;
}
.nvl-title {
  animation: nvl-fadeUp 0.6s ease 0.2s both;
  text-align: center; margin: 8px 0 4px;
  font-size: 28px; color: #4a2d8f; font-weight: 700;
}
.nvl-sub {
  animation: nvl-fadeUp 0.6s ease 0.35s both;
  text-align: center; color: #666; font-size: 14px; margin: 0 0 28px;
}
.nvl-field {
  animation: nvl-fadeUp 0.6s ease both;
  margin-bottom: 20px;
}
.nvl-label { font-weight: 700; color: #333; font-size: 14px; }
.nvl-input-wrap { position: relative; }
.nvl-input {
  width: 100%; padding: 12px 16px; margin-top: 8px;
  border-radius: 12px; border: 2px solid #c9b8f0;
  background: white; font-size: 15px; color: #222;
  box-sizing: border-box; outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.nvl-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
}
.nvl-input-bar {
  position: absolute; bottom: 0; left: 16px; right: 16px; height: 2px;
  background: linear-gradient(90deg, #e879a0, #9b79e8, #5baee8);
  border-radius: 2px; transform: scaleX(0); transform-origin: left;
  transition: transform 0.3s ease;
}
.nvl-input:focus ~ .nvl-input-bar { transform: scaleX(1); }

.nvl-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(90deg, #e879a0, #9b79e8, #5baee8);
  color: white; border: none; border-radius: 14px;
  font-size: 16px; font-weight: 700; cursor: pointer;
  animation: nvl-pulse 2.5s ease-in-out infinite;
  transition: transform 0.15s, filter 0.15s;
}
.nvl-btn:hover:not(:disabled) { transform: scale(1.03); filter: brightness(1.08); }
.nvl-btn:active:not(:disabled) { transform: scale(0.98); }
.nvl-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.nvl-error { animation: nvl-shake 0.4s ease; }
`;

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

    useEffect(() => {
        const el = document.createElement('style');
        el.textContent = styles;
        document.head.appendChild(el);
        return () => document.head.removeChild(el);
    }, []);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) { setError('Please enter email and password'); return; }
        try {
            setLoading(true);
            const data = await loginUser(email, password);
            if (data.role === 'ADMIN') navigate('/admin');
            else navigate('/');
        } catch {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: '📧 Email',    type: 'email',    value: email,    set: setEmail,    delay: '0.45s' },
        { label: '🔒 Password', type: 'password', value: password, set: setPassword, delay: '0.55s' },
    ];

    return (
        <div className="nvl-bg">
            {/* orbiting toys */}
            <div className="nvl-orbit-container">
                <span className="nvl-orbit-toy nvl-orbit-a">🧸</span>
                <span className="nvl-orbit-toy nvl-orbit-b">🎮</span>
                <span className="nvl-orbit-toy nvl-orbit-c">🎯</span>
            </div>

            {/* background stars */}
            {[
                { top:'10%', left:'8%',  delay:'0s' },
                { top:'20%', right:'10%',delay:'1s' },
                { top:'70%', left:'6%',  delay:'2s' },
                { bottom:'15%',right:'8%',delay:'1.5s' },
                { top:'45%', left:'3%',  delay:'0.5s' },
            ].map((s,i) => (
                <span key={i} className="nvl-star" style={{ ...s, animationDelay: s.delay }}>✦</span>
            ))}

            <div className="nvl-card">
                <span className="nvl-emoji">🧸</span>
                <h2 className="nvl-title">Welcome Back!</h2>
                <p className="nvl-sub">Login to your Toy Store account</p>

                {isExpired && !error && (
                    <div style={{ background:'#fffbeb', color:'#b45309', border:'1.5px solid #fde68a',
                        borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', fontSize:'14px', fontWeight:'600' }}>
                        🔑 Your session has expired. Please log in again to continue.
                    </div>
                )}

                {error && (
                    <div className="nvl-error" style={{ background:'#ffe5e5', color:'#c0000a',
                        borderRadius:'10px', padding:'10px 16px', marginBottom:'16px', fontSize:'14px', fontWeight:'600' }}>
                        ⚠️ {error}
                    </div>
                )}

                {fields.map(f => (
                    <div key={f.type} className="nvl-field" style={{ animationDelay: f.delay }}>
                        <label className="nvl-label">{f.label}</label>
                        <div className="nvl-input-wrap">
                            <input
                                type={f.type} value={f.value}
                                onChange={e => f.set(e.target.value)}
                                placeholder={`Enter your ${f.type === 'email' ? 'email' : 'password'}`}
                                className="nvl-input"
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            />
                            <div className="nvl-input-bar" />
                        </div>
                    </div>
                ))}

                <button className="nvl-btn" onClick={handleLogin} disabled={loading}
                        style={{ animationDelay:'0.65s' }}>
                    {loading ? '✨ Logging in...' : '🌈 Login'}
                </button>

                <p style={{ textAlign:'center', marginTop:'20px', color:'#555', fontSize:'14px' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color:'#7c3aed', fontWeight:'700', textDecoration:'none' }}>
                        Register here 🌈
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;