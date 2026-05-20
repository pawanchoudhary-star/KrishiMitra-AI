import { useState } from 'react';
import { TrendingUp, TrendingDown, Store, ArrowRight, ShieldCheck, Calculator, Camera, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const cropPrices = {
  'Wheat': [
    { name: 'Jaipur Mandi', basePrice: 2350, diff: '+₹50', up: true },
    { name: 'Sikar Mandi', basePrice: 2310, diff: '-₹10', up: false },
    { name: 'Alwar Mandi', basePrice: 2340, diff: '+₹30', up: true },
  ],
  'Mustard': [
    { name: 'Jaipur Mandi', basePrice: 5400, diff: '+₹120', up: true },
    { name: 'Sikar Mandi', basePrice: 5350, diff: '+₹80', up: true },
    { name: 'Alwar Mandi', basePrice: 5420, diff: '-₹20', up: false },
  ],
  'Bajra': [
    { name: 'Jaipur Mandi', basePrice: 2150, diff: '-₹30', up: false },
    { name: 'Sikar Mandi', basePrice: 2100, diff: '-₹10', up: false },
    { name: 'Alwar Mandi', basePrice: 2180, diff: '+₹20', up: true },
  ],
  'Chana': [
    { name: 'Jaipur Mandi', basePrice: 5800, diff: '+₹150', up: true },
    { name: 'Sikar Mandi', basePrice: 5750, diff: '+₹50', up: true },
    { name: 'Alwar Mandi', basePrice: 5850, diff: '+₹200', up: true },
  ],
  'Guar': [
    { name: 'Jaipur Mandi', basePrice: 5200, diff: '-₹50', up: false },
    { name: 'Sikar Mandi', basePrice: 5150, diff: '-₹80', up: false },
    { name: 'Alwar Mandi', basePrice: 5250, diff: '+₹10', up: true },
  ],
  'Soyabean': [
    { name: 'Jaipur Mandi', basePrice: 4600, diff: '+₹40', up: true },
    { name: 'Sikar Mandi', basePrice: 4550, diff: '+₹10', up: true },
    { name: 'Alwar Mandi', basePrice: 4620, diff: '-₹30', up: false },
  ]
};

export default function Sell() {
  const [quantity, setQuantity] = useState(10); // default 10 kg
  const [crop, setCrop] = useState('Wheat');
  const [cropImage, setCropImage] = useState(null);

  const mandis = cropPrices[crop] || cropPrices['Wheat'];

  const calculatePrice = (base) => {
    if (!quantity || isNaN(quantity)) return '₹0';
    const pricePerKg = base / 100;
    const total = pricePerKg * quantity;
    return `₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageTransition>
      <div className="page-header">
        <h1 className="page-title">Mandi & Sell</h1>
        <p className="page-desc">Check live rates and decide when to sell</p>
      </div>

      {/* Decision Engine Card */}
      <div className="glass" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>AI Suggestion for {crop}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>WAIT 2 WEEKS</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '13px', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '12px' }}>
          Prices are expected to rise by 5-8% due to upcoming festival demand.
        </div>
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px' }}>Calculate Price</h3>
      <div className="glass" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label className="text-sm" style={{ fontWeight: 'bold' }}>I have (मेरे पास है):</label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 10"
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', fontSize: '16px' }}
          />
          <span className="text-body" style={{ fontWeight: 600 }}>Kg</span>
          <select 
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', fontSize: '16px', background: 'white' }}
          >
            <option value="Wheat">Gehu (Wheat)</option>
            <option value="Mustard">Sarson (Mustard)</option>
            <option value="Bajra">Bajra</option>
            <option value="Chana">Chana (Gram)</option>
            <option value="Guar">Guar (Cluster Bean)</option>
            <option value="Soyabean">Soyabean</option>
          </select>
        </div>

        {/* Photo Upload Section */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
          <label className="text-sm" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            Crop Photo (फसल की फोटो अपलोड करें):
          </label>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <input 
              type="file" 
              id="crop-photo-input" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }}
            />
            
            {!cropImage ? (
              <label 
                htmlFor="crop-photo-input"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: '120px',
                  border: '2px dashed var(--primary-green)',
                  borderRadius: '16px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  gap: '8px'
                }}
              >
                <Camera size={32} style={{ color: 'var(--primary-green)' }} />
                <span className="text-sm" style={{ fontWeight: '600', color: 'var(--primary-green)' }}>
                  Upload Crop Photo (फोटो अपलोड करें)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-color-secondary)', opacity: 0.8 }}>
                  Supports JPG, PNG (Max 5MB)
                </span>
              </label>
            ) : (
              <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <img 
                  src={cropImage} 
                  alt="Crop Preview" 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                />
                <button 
                  onClick={() => setCropImage(null)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <X size={16} />
                </button>
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '8px 12px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  Photo Uploaded Successfully!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px' }}>Live Mandi Prices (For {quantity || 0} Kg)</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {mandis.map((item, idx) => (
          <div key={idx} className="glass" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--bg-color)', padding: '8px', borderRadius: '8px', color: 'var(--primary-green)' }}>
                <Store size={20} />
              </div>
              <div>
                <div className="text-body" style={{ fontWeight: 600 }}>{item.name}</div>
                <div className="text-sm">₹{item.basePrice}/q</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-body" style={{ fontWeight: 700, color: 'var(--primary-green-dark)', fontSize: '18px' }}>
                {calculatePrice(item.basePrice)}
              </div>
              <div style={{ fontSize: '12px', color: item.up ? 'var(--primary-green)' : 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.diff} trend
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px' }}>Direct Buyers</h3>
      <div className="glass" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-body" style={{ fontWeight: 600 }}>ITC e-Choupal</div>
            <div className="text-sm">Verified Buyer • Needs {crop}</div>
          </div>
        </div>
        <button style={{ background: 'var(--bg-color)', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)' }}>
          <ArrowRight size={20} />
        </button>
      </div>

    </PageTransition>
  );
}
