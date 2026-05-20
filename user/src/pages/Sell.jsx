import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Store, ArrowRight, ShieldCheck, Calculator, Camera, X, Loader2, Landmark, CheckCircle, FileText } from 'lucide-react';
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

  // Direct buy states
  const [showDealModal, setShowDealModal] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dealId, setDealId] = useState('');
  const [dealHistory, setDealHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const mandis = cropPrices[crop] || cropPrices['Wheat'];

  const calculatePrice = (base) => {
    if (!quantity || isNaN(quantity)) return '₹0';
    const pricePerKg = base / 100;
    const total = pricePerKg * quantity;
    return `₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  // Direct buyer calculations
  const highestMandiPrice = mandis.reduce((max, item) => item.basePrice > max ? item.basePrice : max, 0);
  const directBuyPricePerQuintal = highestMandiPrice + 45; // Premium rate

  const calculatePayout = () => {
    if (!quantity || isNaN(quantity)) return 0;
    const pricePerKg = directBuyPricePerQuintal / 100;
    return pricePerKg * quantity;
  };
  const totalPayout = calculatePayout();

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

  const fetchDealHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('http://localhost:5000/api/deals');
      if (response.ok) {
        const data = await response.json();
        setDealHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch deal history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchDealHistory();
  }, []);

  const handleConfirmDeal = async (e) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim() || !paymentDetails.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cropName: crop,
          quantity: parseFloat(quantity),
          pricePerQuintal: directBuyPricePerQuintal,
          totalPrice: totalPayout,
          buyerName: 'ITC e-Choupal',
          farmerName: farmerName,
          farmerPhone: farmerPhone,
          paymentMethod: paymentMethod,
          paymentDetails: paymentDetails,
          cropPhoto: cropImage // base64 payload
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDealId(data.dealId);
        setSubmitSuccess(true);
        // Refresh deal history list
        fetchDealHistory();
      } else {
        alert(data.error || 'Something went wrong while processing the deal.');
      }
    } catch (error) {
      console.error('Deal submission error:', error);
      alert('Failed to connect to the server. Please check your backend connection.');
    } finally {
      setIsSubmitting(false);
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
        <button 
          onClick={() => {
            setSubmitSuccess(false);
            setShowDealModal(true);
          }}
          style={{ background: 'var(--bg-color)', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)', cursor: 'pointer', transition: 'all 0.2s ease' }}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Premium Deal Modal */}
      {showDealModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="glass scale-in" style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            padding: '24px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Close Button */}
            {!isSubmitting && !submitSuccess && (
              <button 
                onClick={() => setShowDealModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-dark)'
                }}
              >
                <X size={18} />
              </button>
            )}

            {/* Modal Content */}
            {!submitSuccess ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-h3" style={{ margin: 0, fontSize: '18px' }}>ITC e-Choupal Direct Buy</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-light)' }}>Verified Secure Transaction Ledger</p>
                  </div>
                </div>

                {/* Deal Summary Card */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="text-sm" style={{ fontWeight: 600, color: 'var(--text-light)' }}>Selected Crop (फसल):</span>
                      <div className="text-body" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-dark)' }}>
                        {crop === 'Wheat' ? 'Gehu (Wheat)' : crop === 'Mustard' ? 'Sarson (Mustard)' : crop === 'Chana' ? 'Chana (Gram)' : crop === 'Guar' ? 'Guar (Cluster Bean)' : crop}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="text-sm" style={{ fontWeight: 600, color: 'var(--text-light)' }}>Total Quantity:</span>
                      <div className="text-body" style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-dark)' }}>{quantity} Kg</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '10px' }}>
                    <div>
                      <span className="text-sm" style={{ color: 'var(--text-light)' }}>Direct Buy Rate:</span>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#2563eb' }}>
                        ₹{directBuyPricePerQuintal}/quintal 
                        <span style={{ fontSize: '11px', color: '#10b981', marginLeft: '6px' }}>(+₹45 Bonus! 🎁)</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="text-sm" style={{ color: 'var(--text-light)', fontWeight: 600 }}>Total Payout:</span>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-green-dark)' }}>
                        ₹{totalPayout.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Image Attachment Preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    {cropImage ? (
                      <>
                        <img 
                          src={cropImage} 
                          alt="Crop preview" 
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                        />
                        <span className="text-sm" style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Photo Attached Successfully
                        </span>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <span className="text-sm" style={{ color: 'var(--accent-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          ⚠️ Crop Photo Required for Direct Purchase Verification
                        </span>
                        <input 
                          type="file" 
                          id="modal-crop-photo-input" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          style={{ display: 'none' }}
                        />
                        <label 
                          htmlFor="modal-crop-photo-input"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px',
                            border: '1.5px dashed var(--primary-green)',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.05)',
                            cursor: 'pointer',
                            gap: '8px'
                          }}
                        >
                          <Camera size={18} style={{ color: 'var(--primary-green)' }} />
                          <span className="text-sm" style={{ fontWeight: '600', color: 'var(--primary-green)' }}>
                            Upload Crop Photo (फोटो अपलोड करें)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleConfirmDeal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label className="text-sm" style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>Farmer Name (किसान का पूरा नाम) *</label>
                    <input 
                      type="text" 
                      required 
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      placeholder="e.g. Pawan Choudhary"
                      disabled={isSubmitting}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label className="text-sm" style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>Mobile Number (मोबाइल नंबर) *</label>
                    <input 
                      type="tel" 
                      required 
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      placeholder="e.g. 882455xxxx"
                      disabled={isSubmitting}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label className="text-sm" style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>Payment Mode (भुगतान का प्रकार) *</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        disabled={isSubmitting}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: paymentMethod === 'UPI' ? '2px solid #3b82f6' : '1px solid var(--glass-border)',
                          background: paymentMethod === 'UPI' ? 'rgba(59, 130, 246, 0.08)' : 'white',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          color: paymentMethod === 'UPI' ? '#2563eb' : 'var(--text-dark)'
                        }}
                      >
                        <ShieldCheck size={16} /> UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Bank Transfer')}
                        disabled={isSubmitting}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          border: paymentMethod === 'Bank Transfer' ? '2px solid #3b82f6' : '1px solid var(--glass-border)',
                          background: paymentMethod === 'Bank Transfer' ? 'rgba(59, 130, 246, 0.08)' : 'white',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          color: paymentMethod === 'Bank Transfer' ? '#2563eb' : 'var(--text-dark)'
                        }}
                      >
                        <Landmark size={16} /> Bank A/C
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm" style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>
                      {paymentMethod === 'UPI' ? 'UPI ID (जैसे: pawanchoudhary@ybl) *' : 'Bank Account Details (A/C No, IFSC Code) *'}
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                      placeholder={paymentMethod === 'UPI' ? 'e.g. farmername@upi' : 'A/C: 1234567890, IFSC: SBIN0001234'}
                      disabled={isSubmitting}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none' }}
                    />
                  </div>

                  {/* Submission Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowDealModal(false)}
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '14px',
                        background: '#f3f4f6',
                        border: 'none',
                        color: '#4b5563',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !cropImage}
                      style={{
                        flex: 2,
                        padding: '14px',
                        borderRadius: '14px',
                        background: (!cropImage) ? 'rgba(16, 185, 129, 0.5)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 700,
                        cursor: (!cropImage || isSubmitting) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Working...
                        </>
                      ) : (
                        'Confirm & Sell (बेचें)'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Page within Modal */
              <div style={{
                textAlign: 'center',
                padding: '24px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  marginBottom: '8px'
                }}>
                  <CheckCircle size={48} />
                </div>
                
                <h3 className="text-h3" style={{ color: '#047857', fontSize: '22px', margin: 0 }}>Deal Confirmed! 🎉</h3>
                <p className="text-body" style={{ fontWeight: 500, margin: 0, color: 'var(--text-dark)' }}>
                  आपका सौदा **ITC e-Choupal** के साथ सफलतापूर्वक पक्का हो गया है।
                </p>

                <div style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-light)' }}>Deal Reference ID:</span>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-dark)' }}>#{dealId.substring(dealId.length - 8).toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-light)' }}>Farmer Name:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{farmerName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-light)' }}>Crop & Quantity:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{crop} ({quantity} Kg)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '8px' }}>
                    <span style={{ color: 'var(--text-light)', fontWeight: 'bold' }}>Locked Payout:</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary-green-dark)', fontSize: '15px' }}>
                      ₹{totalPayout.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-light)',
                  background: 'rgba(59, 130, 246, 0.05)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  marginTop: '4px'
                }}>
                  ℹ️ Our logistics representative will call you on **{farmerPhone}** within 24 hours to schedule crop inspection and secure pickup.
                </div>

                <button
                  onClick={() => {
                    setShowDealModal(false);
                    setSubmitSuccess(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  Done (ठीक है)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      <h3 className="text-h3" style={{ marginTop: '28px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)' }}>
        <FileText size={20} style={{ color: 'var(--primary-green)' }} /> 
        Your Deal History (आपके सौदे)
      </h3>

      {isLoadingHistory ? (
        <div className="glass" style={{ padding: '24px', textAlign: 'center' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary-green)', margin: '0 auto 8px' }} />
          <span className="text-body" style={{ color: 'var(--text-dark)' }}>Fetching transactions from secure ledger...</span>
        </div>
      ) : dealHistory.length === 0 ? (
        <div className="glass" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)', fontSize: '14px' }}>
          No direct deals made yet. When you sell crops directly to ITC e-Choupal, your secure transactions will be recorded here!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {dealHistory.map((deal) => (
            <div key={deal._id} className="glass fade-in" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {deal.cropPhoto ? (
                  <img 
                    src={deal.cropPhoto} 
                    alt={deal.cropName} 
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                  />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                    <ShieldCheck size={24} />
                  </div>
                )}
                <div>
                  <div className="text-body" style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                    {deal.cropName} ({deal.quantity} {deal.unit || 'Kg'})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                    Buyer: {deal.buyerName} • {new Date(deal.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary-green-dark)', fontSize: '16px' }}>
                  ₹{deal.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: deal.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: deal.status === 'Completed' ? '#047857' : '#d97706',
                  marginTop: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: deal.status === 'Completed' ? '#10b981' : '#f59e0b' }}></span>
                  {deal.status === 'Completed' ? 'Completed' : 'Pending Verification'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </PageTransition>
  );
}
