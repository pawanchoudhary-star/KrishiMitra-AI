import { ArrowLeft, Droplets, Bug, Sprout, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PageTransition from '../components/PageTransition';

export default function CropCare() {
  const [isIrrigationDone, setIsIrrigationDone] = useState(false);
  const navigate = useNavigate();

  const handleMarkDone = () => {
    setIsIrrigationDone(true);
  };

  const handleViewGuide = () => {
    // Navigate to Chatbot with a pre-filled query asking for guidance
    navigate('/chat?q=How to spray Neem oil for Aphids in Wheat? Please give a step-by-step guide in simple language.');
  };

  return (
    <PageTransition>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--text-dark)' }}>
          <ArrowLeft size={28} />
        </Link>
        <h1 className="page-title" style={{ margin: 0 }}>Crop Care</h1>
      </div>

      <div className="glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--primary-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sprout size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="text-body" style={{ fontWeight: 700 }}>Wheat - Field 1</div>
          <div className="text-sm">Day 45 (Tillering Stage)</div>
        </div>
        <div style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
          Good
        </div>
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px' }}>Today's Action Plan</h3>

      <div className="glass" style={{ padding: '20px', marginBottom: '16px', borderLeft: isIrrigationDone ? '4px solid #10b981' : '4px solid #3b82f6', opacity: isIrrigationDone ? 0.7 : 1, transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ color: isIrrigationDone ? '#10b981' : '#3b82f6', background: isIrrigationDone ? '#d1fae5' : '#dbeafe', padding: '10px', borderRadius: '12px', transition: 'all 0.3s ease' }}>
            <Droplets size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="text-body" style={{ fontWeight: 700, marginBottom: '4px', textDecoration: isIrrigationDone ? 'line-through' : 'none' }}>Irrigation Needed</div>
            <div className="text-sm" style={{ marginBottom: '12px' }}>Soil moisture is low. Apply light irrigation today or tomorrow before 10 AM.</div>
            {isIrrigationDone ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '14px', fontWeight: 700 }}>
                <CheckCircle2 size={18} /> Done
              </div>
            ) : (
              <button onClick={handleMarkDone} style={{ background: 'var(--bg-color)', border: '1px solid #3b82f6', color: '#3b82f6', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Mark as Done
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '20px', marginBottom: '16px', borderLeft: '4px solid #ef4444' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ color: '#ef4444', background: '#fee2e2', padding: '10px', borderRadius: '12px' }}>
            <Bug size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="text-body" style={{ fontWeight: 700, marginBottom: '4px' }}>Preventive Spray</div>
            <div className="text-sm" style={{ marginBottom: '12px' }}>Risk of Aphids in current weather. Spray Neem oil or recommended organic pesticide.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleViewGuide} style={{ background: 'var(--bg-color)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                View Guide
              </button>
            </div>
          </div>
        </div>
      </div>

    </PageTransition>
  );
}
