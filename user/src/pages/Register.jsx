import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      alert("Please fill all details");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, phone, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert('Registration Successful! Please login.');
        // After register, redirect to login
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to connect to the server. Please ensure the backend is running.');
    }
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="text-h1" style={{ color: 'var(--primary-green-dark)' }}>KrishiMitra AI</h1>
          <p className="text-body" style={{ color: 'var(--text-light)', marginTop: '8px' }}>Smart Farming Decision Assistant</p>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h2 className="text-h2" style={{ marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="text-sm" style={{ marginBottom: '8px', display: 'block' }}>Full Name (पूरा नाम)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pawan Kumar" 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none' }}
              />
            </div>
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
              Register (रजिस्टर करें)
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span className="text-sm">Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary-green)', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
