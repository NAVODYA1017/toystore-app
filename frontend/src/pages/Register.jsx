import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../features/user-management/userService';

const styles = `
@keyframes nvl-bgShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes nvl-floatToyReg {
  0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
  50%       { transform: translateY(-14px) scale(1.08) rotate(6deg); }
}
@keyframes nvl-cardInReg {
  from { opacity: 0; transform: translateY(50px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0px) scale(1); }
}
@keyframes nvl-fadeUpReg {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nvl-bubbleFloat {
  0%   { transform: translateY(100vh) scale(0.6); opacity: 0; }
  10%  { opacity: 0.5; }
  90%  { opacity: 0.3; }
  100% { transform: translateY(-120px) scale(1); opacity: 0; }
}
@keyframes nvl-successBounce {
  0%   { transform: scale(0.8); opacity: 0; }
  60%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes nvl-pulseReg {
  0%, 100% { box-shadow: 0 4px 18px rgba(155,121,232,0.4); }
  50%       { box-shadow: 0 6px 30px rgba(155,121,232,0.7); }
}
@keyframes nvl-shakeReg {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-8px); }
  40%     { transform: translateX(8px); }
  60%     { transform: translateX(-5px); }
  80%     { transform: translateX(5px); }
}

.nvl-reg-bg {
  min-height: 100vh;
  background: linear-gradient(270deg, #f093fb, #f5576c, #a78bfa, #7c3aed, #6366f1, #667eea);
  background-size: 400% 400%;
  animation: nvl-bgShift 10s ease infinite;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; position: relative; overflow: hidden;
}
.nvl-bubble {
  position: absolute; border-radius: 50%;
  background: rgba(255,255,255,0.12);
  animation: nvl-bubbleFloat linear infinite;
  pointer-events: none;
}
.nvl-reg-card {
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  border-radius: 24px; padding: 44px 40px;
  width: 100%; max-width: 440px;
  box-shadow: 0 8px 40px rgba(100,60,200,0.3);
  border: 1.5px solid rgba(255,255,255,0.85);
  animation: nvl-cardInReg 0.75s cubic-bezier(.22,1,.36,1) both;
}
.nvl-reg-emoji {
  font-size: 52px; display: block; text-align: center;
  animation: nvl-floatToyReg 3.5s ease-in-out infinite;
}
.nvl-reg-title {
  animation: nvl-fadeUpReg 0.6s ease 0.2s both;
  text-align: center; margin: 8px 0 4px;
  font-size: 28px; color: #4a2d8f; font-weight: 700;
}
.nvl-reg-sub {
  animation: nvl-fadeUpReg 0.6s ease 0.3s both;
  text-align: center; color: #666; font-size: 14px; margin: 0 0 24px;
}
.nvl-reg-field { animation: nvl-fadeUpReg 0.5s ease both; margin-bottom: 14px; }
.nvl-reg-label { font-weight: 700; color: #333; font-size: 14px; }
.nvl-reg-input-wrap { position: relative; }
.nvl-reg-input {
  width: 100%; padding: 12px 16px; margin-top: 6px;
  border-radius: 12px; border: 2px solid #c9b8f0;
  background: white; font-size: 15px; color: #222;
  box-sizing: border-box; outline: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.nvl-reg-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
}
.nvl-reg-input-bar {
  position: absolute; bottom: 0; left: 16px; right: 16px; height: 2px;
  background: linear-gradient(90deg, #f7a8c4, #f7d9a8, #a8f0c0, #a8d8f7, #d0a8f7);
  border-radius: 2px; transform: scaleX(0); transform-origin: left;
  transition: transform 0.3s ease;
}
.nvl-reg-input:focus ~ .nvl-reg-input-bar { transform: scaleX(1); }
.nvl-reg-btn {
  width: 100%; padding: 14px; margin-top: 16px;
  background: linear-gradient(90deg, #e879a0, #9b79e8, #5baee8, #a8f0c0);
  background-size: 200% auto;
  color: white; border: none; border-radius: 14px;
  font-size: 16px; font-weight: 700; cursor: pointer;
  animation: nvl-pulseReg 2.5s ease-in-out infinite;
  transition: transform 0.15s, filter 0.15s, background-position 0.4s;
}
.nvl-reg-btn:hover:not(:disabled) {
  transform: scale(1.03); filter: brightness(1.08);
  background-position: right center;
}
.nvl-reg-btn:active:not(:disabled) { transform: scale(0.98); }
.nvl-reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.nvl-reg-error { animation: nvl-shakeReg 0.4s ease; }
.nvl-reg-success { animation: nvl-successBounce 0.5s ease both; }
`;

const BUBBLES = [
    { size: 60,  left: '10%', delay: '0s',   dur: '8s'  },
    { size: 40,  left: '25%', delay: '2s',   dur: '10s' },
    { size: 80,  left: '50%', delay: '1s',   dur: '12s' },
    { size: 30,  left: '70%', delay: '3s',   dur: '7s'  },
    { size: 55,  left: '85%', delay: '0.5s', dur: '9s'  },
    { size: 25,  left: '40%', delay: '4s',   dur: '11s' },
];

function Register() {
    const navigate = useNavigate();
    const [form, setForm]       = useState({ name:'', email:'', password:'', phone:'', address:'' });
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const el = document.createElement('style');
        el.textContent = styles;
        document.head.appendChild(el);
        return () => document.head.removeChild(el);
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async () => {
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('Name, email and password are required'); return;
        }
        try {
            setLoading(true);
            await registerUser(form);
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch {
            setError('Email already exists or registration failed');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name:'name',     label:'👤 Full Name', type:'text',     delay:'0.4s'  },
        { name:'email',    label:'📧 Email',     type:'email',    delay:'0.5s'  },
        { name:'password', label:'🔒 Password',  type:'password', delay:'0.6s'  },
        { name:'phone',    label:'📱 Phone',     type:'text',     delay:'0.7s'  },
        { name:'address',  label:'🏠 Address',   type:'text',     delay:'0.8s'  },
    ];

    return (
        <div className="nvl-reg-bg">
            {BUBBLES.map((b, i) => (
                <div key={i} className="nvl-bubble" style={{
                    width: b.size, height: b.size,
                    left: b.left, bottom: '-80px',
                    animationDelay: b.delay, animationDuration: b.dur,
                }} />
            ))}

            <div className="nvl-reg-card">
                <span className="nvl-reg-emoji">🌸</span>
                <h2 className="nvl-reg-title">Create Account</h2>
                <p className="nvl-reg-sub">Join the Toy Store family!</p>

                {error && (
                    <div className="nvl-reg-error" style={{ background:'#ffe5e5', color:'#c0000a',
                        borderRadius:'10px', padding:'10px 16px', marginBottom:'16px', fontSize:'14px', fontWeight:'600' }}>
                        ⚠️ {error}
                    </div>
                )}
                {success && (
                    <div className="nvl-reg-success" style={{ background:'#e5ffe5', color:'#1a7a1a',
                        borderRadius:'10px', padding:'10px 16px', marginBottom:'16px', fontSize:'14px', fontWeight:'600' }}>
                        ✅ {success}
                    </div>
                )}

                {fields.map(f => (
                    <div key={f.name} className="nvl-reg-field" style={{ animationDelay: f.delay }}>
                        <label className="nvl-reg-label">{f.label}</label>
                        <div className="nvl-reg-input-wrap">
                            <input
                                type={f.type} name={f.name}
                                value={form[f.name]} onChange={handleChange}
                                placeholder={`Enter your ${f.name}`}
                                className="nvl-reg-input"
                            />
                            <div className="nvl-reg-input-bar" />
                        </div>
                    </div>
                ))}

                <button className="nvl-reg-btn" onClick={handleRegister} disabled={loading}>
                    {loading ? '✨ Creating account...' : '🌈 Register'}
                </button>

                <p style={{ textAlign:'center', marginTop:'20px', color:'#555', fontSize:'14px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color:'#7c3aed', fontWeight:'700', textDecoration:'none' }}>
                        Login here 🌈
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;