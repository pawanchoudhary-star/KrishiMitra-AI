import { useState } from 'react';
import { AlertTriangle, CloudLightning, ShieldAlert, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

export default function Alerts() {
  const [sosSent, setSosSent] = useState(false);

  const handleSos = () => {
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
    }, 4000);
  };

  return (
    <PageTransition>
      <div className="page-header">
        <h1 className="page-title">Alerts & Emergency</h1>
        <p className="page-desc">Important updates and quick help</p>
      </div>

      <AnimatePresence>
        {sosSent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#059669',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)',
              zIndex: 1000,
              width: 'max-content'
            }}
          >
            <CheckCircle2 size={24} />
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SOS Alert Sent Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Button */}
      <button 
        onClick={handleSos}
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
          boxShadow: '0 12px 24px rgba(239, 68, 68, 0.3)',
          marginBottom: '32px',
          cursor: 'pointer'
        }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%' }}>
          <ShieldAlert size={36} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>SOS Help</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>One-click emergency response</div>
        </div>
      </button>

      <h3 className="text-h3" style={{ marginBottom: '16px' }}>Recent Alerts</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass" style={{ padding: '16px', display: 'flex', gap: '16px', borderLeft: '4px solid #fbbf24' }}>
          <div style={{ color: '#fbbf24', marginTop: '4px' }}>
            <CloudLightning size={24} />
          </div>
          <div>
            <div className="text-body" style={{ fontWeight: 700, marginBottom: '4px' }}>Heavy Rain Warning</div>
            <div className="text-sm" style={{ marginBottom: '8px' }}>Expected heavy rainfall in Jaipur district in the next 48 hours. Please secure harvested crops.</div>
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
