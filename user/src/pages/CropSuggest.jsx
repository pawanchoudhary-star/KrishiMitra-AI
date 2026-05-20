import { Check, Info, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function CropSuggest() {
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    navigate('/chat?q=I want to start planting Mustard (Sarson). Please give me a complete 120-day step-by-step crop calendar and planning guide.');
  };

  return (
    <PageTransition>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--text-dark)' }}>
          <ArrowLeft size={28} />
        </Link>
        <h1 className="page-title" style={{ margin: 0 }}>Kya Ugau?</h1>
      </div>

      <p className="page-desc" style={{ marginBottom: '24px' }}>
        Based on your soil type, weather, and market demand, here are the best crops to plant this season.
      </p>

      <div className="glass" style={{ padding: '20px', border: '2px solid var(--primary-green)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ background: 'var(--primary-green)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Top Pick</div>
            </div>
            <h2 className="text-h2">Mustard (Sarson)</h2>
          </div>
          <div style={{ background: '#ecfdf5', color: '#059669', padding: '8px', borderRadius: '12px', fontWeight: 'bold' }}>
            85% Match
          </div>
        </div>

        <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', gap: '12px' }}>
          <Info size={20} color="var(--primary-green)" style={{ flexShrink: 0 }} />
          <div className="text-sm" style={{ color: 'var(--text-dark)' }}>
            <strong>Why this suggestion?</strong> Soil moisture is low and upcoming weather is dry. Mustard requires less water and current Mandi prices are high.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} color="var(--primary-green)" />
            <span className="text-sm">Low water need</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} color="var(--primary-green)" />
            <span className="text-sm">High market price</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} color="var(--primary-green)" />
            <span className="text-sm">120 days to harvest</span>
          </div>
        </div>

        <button onClick={handleStartPlanning} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary-green)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          Start Planning
        </button>
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px' }}>Other Options</h3>
      
      <div className="glass" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div className="text-body" style={{ fontWeight: 700 }}>Wheat (Gehu)</div>
          <div className="text-sm">High water requirement</div>
        </div>
        <div style={{ background: '#fef3c7', color: '#d97706', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
          65% Match
        </div>
      </div>

    </PageTransition>
  );
}
