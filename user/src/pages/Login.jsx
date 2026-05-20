import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      alert("Please enter phone and password");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('registeredName', data.user.name);
        localStorage.setItem('registeredPhone', data.user.phone);
        navigate('/');
      } else {
        alert(data.error || "Invalid phone number or password!");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to connect to the server. Please ensure the backend is running.');
    }
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="text-h1" style={{ color: 'var(--primary-green-dark)' }}>KrishiMitra AI</h1>
          <p className="text-body" style={{ color: 'var(--text-light)', marginTop: '8px' }}>Welcome Back!</p>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h2 className="text-h2" style={{ marginBottom: '24px', textAlign: 'center' }}>Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="text-sm" style={{ marginBottom: '8px', display: 'block' }}>Phone Number (फ़ोन नंबर)</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91" 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none' }}
              />
            </div>
            <div>
              <label className="text-sm" style={{ marginBottom: '8px', display: 'block' }}>Password (पासवर्ड)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none' }}
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary-green)', 
                color: 'white', border: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' 
              }}>
              Login (लॉग इन करें)
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span className="text-sm">Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary-green)', fontWeight: 'bold', textDecoration: 'none' }}>Register</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
