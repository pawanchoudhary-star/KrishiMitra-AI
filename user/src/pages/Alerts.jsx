import { useState, useEffect } from 'react';
import { AlertTriangle, CloudLightning, ShieldAlert, CheckCircle2, MapPin, PhoneCall, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

export default function Alerts() {
  const [sosSent, setSosSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sosData, setSosData] = useState(null);

  // Load session coordinates
  const userName = localStorage.getItem('registeredName') || 'Pawan Kumar';
  const phone = localStorage.getItem('registeredPhone') || '+91 78518 76776';
  
  let activeLoc = { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873 };
  const storedActive = localStorage.getItem('activeLocation');
  if (storedActive) {
    try {
      activeLoc = JSON.parse(storedActive);
    } catch (e) {
      // Keep default
    }
  }

  const handleSos = async () => {
    setIsSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          farmerName: userName,
          farmerPhone: phone,
          locationName: activeLoc.name,
          latitude: activeLoc.lat,
          longitude: activeLoc.lon
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSosData(data.sos);
        setSosSent(true);
      } else {
        alert('Failed to register SOS emergency on backend');
      }
    } catch (err) {
      console.error(err);
      alert('Error establishing connection to backend SOS server');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageTransition>
      <div className="page-header">
        <h1 className="page-title" style={{ color: 'var(--primary-green-dark)' }}>Alerts & Emergency</h1>
        <p className="page-desc">Important environmental alerts & quick emergency logs</p>
      </div>

      {/* SOS Alert Sent Confirmation */}
      <AnimatePresence>
        {sosSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass"
            style={{
              padding: '20px',
              border: '2px solid red',
              background: 'rgba(254, 226, 226, 0.95)',
              marginBottom: '24px',
              boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#dc2626', marginBottom: '12px' }}>
              <CheckCircle2 size={24} />
              <span style={{ fontWeight: '800', fontSize: '18px' }}>Emergency Registered successfully!</span>
            </div>
            
            {sosData && (
              <div style={{ fontSize: '14px', color: '#7f1d1d', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Farmer:</strong> {sosData.farmerName} ({sosData.farmerPhone})</div>
                <div><strong>Coordinates:</strong> {sosData.latitude.toFixed(4)}° N, {sosData.longitude.toFixed(4)}° E</div>
                <div><strong>Region:</strong> {sosData.locationName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#dc2626', fontWeight: 'bold' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'red', display: 'inline-block', animation: 'spin 1.5s infinite' }} />
                  Local disaster coordinator team dispatched.
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setSosSent(false)} 
              style={{
                width: '100%', padding: '10px', marginTop: '14px', borderRadius: '8px', 
                border: 'none', background: '#dc2626', color: 'white', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              Acknowledge & Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Button */}
      <button 
        onClick={handleSos}
        disabled={isSending || sosSent}
        style={{ 
          width: '100%', 
          padding: '24px', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 12px 24px rgba(239, 68, 68, 0.35)',
          marginBottom: '32px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="sos-button"
      >
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%' }}>
          {isSending ? <Loader2 size={36} className="animate-spin" /> : <ShieldAlert size={36} />}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>
            {isSending ? 'Registering SOS...' : 'SOS Emergency Help'}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Press to log coordinate coordinates to MongoDB
          </div>
        </div>
      </button>

      <h3 className="text-h3" style={{ marginBottom: '16px', color: 'var(--primary-green-dark)' }}>Recent Alerts</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <div className="glass" style={{ padding: '16px', display: 'flex', gap: '16px', borderLeft: '4px solid #fbbf24' }}>
          <div style={{ color: '#fbbf24', marginTop: '4px' }}>
            <CloudLightning size={24} />
          </div>
          <div>
            <div className="text-body" style={{ fontWeight: 700, marginBottom: '4px' }}>Heavy Rain Warning</div>
            <div className="text-sm" style={{ marginBottom: '8px' }}>Expected heavy rainfall in {activeLoc.name.split(',')[0]} district in the next 48 hours. Please secure harvested crops.</div>
            <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>2 hours ago</div>
          </div>
        </div>

        <div className="glass" style={{ padding: '16px', display: 'flex', gap: '16px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#ef4444', marginTop: '4px' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-body" style={{ fontWeight: 700, marginBottom: '4px' }}>Locust Swarm Alert</div>
            <div className="text-sm" style={{ marginBottom: '8px' }}>Possible locust swarm movement detected near your region. Keep pesticides ready.</div>
            <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>1 day ago</div>
          </div>
        </div>
      </div>

    </PageTransition>
  );
}
