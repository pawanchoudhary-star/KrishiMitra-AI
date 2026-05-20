import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Award, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Sprout,
  DollarSign
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

export default function Schemes() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  
  // State variables
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  
  // Eligibility calculator states
  const [landSize, setLandSize] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [userCrops, setUserCrops] = useState([]);
  
  const farmerPhone = localStorage.getItem('registeredPhone') || '';

  // Filter Categories
  const categories = [
    { id: 'All', labelEn: 'All Schemes', labelHi: 'सभी योजनाएं' },
    { id: 'Financial', labelEn: 'Financial', labelHi: 'वित्तीय सहायता' },
    { id: 'Insurance', labelEn: 'Insurance', labelHi: 'फसल बीमा' },
    { id: 'Irrigation', labelEn: 'Irrigation', labelHi: 'सिंचाई एवं जल' },
    { id: 'Machinery', labelEn: 'Machinery', labelHi: 'कृषि उपकरण' }
  ];

  // Crop list for dropdown
  const cropList = [
    { id: 'Wheat', labelEn: 'Wheat', labelHi: 'गेहूं' },
    { id: 'Mustard', labelEn: 'Mustard', labelHi: 'सरसों' },
    { id: 'Rice', labelEn: 'Rice', labelHi: 'चावल' },
    { id: 'Bajra', labelEn: 'Bajra', labelHi: 'बाजरा' },
    { id: 'Soyabean', labelEn: 'Soyabean', labelHi: 'सोयाबीन' },
    { id: 'Cotton', labelEn: 'Cotton', labelHi: 'कपास' },
    { id: 'Chana', labelEn: 'Chana', labelHi: 'चना' },
    { id: 'Tomato', labelEn: 'Tomato', labelHi: 'टमाटर' },
    { id: 'Potato', labelEn: 'Potato', labelHi: 'आलू' },
    { id: 'Chilli', labelEn: 'Chilli', labelHi: 'मिर्च' },
    { id: 'Others', labelEn: 'Others', labelHi: 'अन्य' }
  ];

  // Fetch schemes & profile data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Government Schemes from backend
        const schemesRes = await fetch('http://localhost:5000/api/schemes');
        if (!schemesRes.ok) {
          throw new Error('Failed to fetch schemes from database.');
        }
        const schemesData = await schemesRes.json();
        setSchemes(schemesData);

        // 2. Fetch Farmer's registered crops if available to pre-fill eligibility calculator
        if (farmerPhone) {
          const cropsRes = await fetch(`http://localhost:5000/api/crops?phone=${encodeURIComponent(farmerPhone)}`);
          if (cropsRes.ok) {
            const cropsData = await cropsRes.json();
            setUserCrops(cropsData);
            
            if (cropsData.length > 0) {
              // Pre-fill with the first registered crop
              const firstCrop = cropsData[0];
              setLandSize(firstCrop.area.toString());
              setSelectedCrop(firstCrop.cropName);
              setEligibilityChecked(true); // Automatically show calculations!
              setIsCheckerOpen(true); // Automatically expand eligibility panel!
            }
          }
        }
      } catch (err) {
        console.error('Error fetching schemes/crops:', err);
        setError(err.message || 'Connection to backend failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmerPhone]);

  // Eligibility Calculation Logic
  const checkEligibility = (scheme) => {
    if (!eligibilityChecked) return null;
    if (!landSize) return 'CHECK_DETAILS';

    const land = parseFloat(landSize);
    if (isNaN(land) || land <= 0) return 'CHECK_DETAILS';

    // 1. Land size bounds check
    const minL = scheme.minLandAcres || 0;
    const maxL = scheme.maxLandAcres || 999;

    if (land < minL || land > maxL) {
      return 'INELIGIBLE';
    }

    // 2. Crop restriction check
    if (!scheme.eligibleCrops || scheme.eligibleCrops.length === 0) {
      return 'ELIGIBLE'; // If empty, all crops are eligible
    }

    if (!selectedCrop) {
      return 'CHECK_DETAILS'; // Land matches, but crop has restrictions and is not selected
    }

    const matched = scheme.eligibleCrops.some(
      c => c.toLowerCase() === selectedCrop.toLowerCase()
    );

    return matched ? 'ELIGIBLE' : 'INELIGIBLE';
  };

  // Click handler to auto-fill with a saved crop from Profile
  const handleQuickSelectCrop = (crop) => {
    setLandSize(crop.area.toString());
    setSelectedCrop(crop.cropName);
    setEligibilityChecked(true);
  };

  // Reset eligibility calculator
  const handleClearCalculator = () => {
    setLandSize('');
    setSelectedCrop('');
    setEligibilityChecked(false);
  };

  // Redirect to AI chat with detailed prompt
  const handleAskAI = (scheme) => {
    const schemeTitle = lang === 'hi' ? scheme.titleHindi : scheme.title;
    const prompt = lang === 'hi'
      ? `मैं "${schemeTitle}" के लिए ऑनलाइन आवेदन कैसे करूं? इसके लिए कौन से दस्तावेज आवश्यक हैं और इसकी पात्रता मानदंड क्या हैं? कृपया मुझे चरण-दर-चरण मार्गदर्शन दें।`
      : `How do I apply for "${schemeTitle}" online? What documents are required and what are the detailed eligibility criteria? Please provide a step-by-step guide.`;

    navigate(`/chat?q=${encodeURIComponent(prompt)}`);
  };

  // Filter schemes by category tab
  const filteredSchemes = activeCategory === 'All'
    ? schemes
    : schemes.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Category-specific theme accent lines
  const getCategoryStyles = (category) => {
    switch (category.toLowerCase()) {
      case 'financial':
        return { borderLeft: '4px solid #10b981', badgeBg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'insurance':
        return { borderLeft: '4px solid #3b82f6', badgeBg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
      case 'irrigation':
        return { borderLeft: '4px solid #06b6d4', badgeBg: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' };
      case 'machinery':
        return { borderLeft: '4px solid #f59e0b', badgeBg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      default:
        return { borderLeft: '4px solid #6b7280', badgeBg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' };
    }
  };

  return (
    <PageTransition>
      {/* Header section with back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <Link to="/" style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={28} />
        </Link>
        <div>
          <h1 className="text-h1" style={{ margin: 0, color: 'var(--text-dark)' }}>
            {t('schemes_header')}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-green)' }}>
              {lang === 'hi' ? 'सीधे डेटाबेस से लाइव' : 'Live from MongoDB'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass fade-in" style={{ padding: '20px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', textAlign: 'center' }}>
          <AlertTriangle size={40} color="var(--accent-red)" style={{ margin: '0 auto 12px' }} />
          <p className="text-body" style={{ fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '8px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '8px 16px', background: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {lang === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '16px' }}>
          <Loader2 size={44} className="animate-spin" color="var(--primary-green)" />
          <p style={{ fontSize: '15px', color: 'var(--text-light)', fontWeight: 'bold' }}>
            {lang === 'hi' ? 'डेटाबेस से योजनाएं लोड हो रही हैं...' : 'Fetching active schemes from database...'}
          </p>
        </div>
      ) : (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Eligibility Matcher Accordion Card */}
          <div className="glass" style={{ padding: '16px', overflow: 'hidden', transition: 'all 0.3s ease', border: '1px solid var(--glass-border)' }}>
            <div 
              onClick={() => setIsCheckerOpen(!isCheckerOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '8px', borderRadius: '12px' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-h3" style={{ fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)' }}>
                    {t('eligibility_checker')}
                    {userCrops.length > 0 && (
                      <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary-green-dark)', padding: '2px 6px', borderRadius: '8px', fontWeight: '800' }}>
                        {lang === 'hi' ? 'प्रोफ़ाइल लिंक्ड' : 'Profile Linked'}
                      </span>
                    )}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                    {lang === 'hi' ? 'अपनी भूमि और फसल के आधार पर योजनाएं खोजें' : 'Check which schemes match your farming profile'}
                  </p>
                </div>
              </div>
              {isCheckerOpen ? <ChevronUp size={20} color="var(--text-dark)" /> : <ChevronDown size={20} color="var(--text-dark)" />}
            </div>

            {isCheckerOpen && (
              <div className="scale-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px' }}>
                
                {/* Saved crops quick chips */}
                {userCrops.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {lang === 'hi' ? 'सहेजी गई फसलों से त्वरित चयन:' : 'Quick select from your crops:'}
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {userCrops.map((crop) => (
                        <button
                          key={crop._id}
                          onClick={() => handleQuickSelectCrop(crop)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: selectedCrop === crop.cropName && parseFloat(landSize) === crop.area ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.4)',
                            border: selectedCrop === crop.cropName && parseFloat(landSize) === crop.area ? '1px solid var(--primary-green)' : '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: selectedCrop === crop.cropName && parseFloat(landSize) === crop.area ? 'var(--primary-green-dark)' : 'var(--text-dark)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Sprout size={13} color="var(--primary-green)" />
                          {lang === 'hi' && crop.cropName === 'Wheat' ? 'गेहूं' : lang === 'hi' && crop.cropName === 'Mustard' ? 'सरसों' : crop.cropName} ({crop.area} {t('acres')})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Land Size Input */}
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>
                      {t('land_size_acres')}
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      value={landSize}
                      onChange={(e) => {
                        setLandSize(e.target.value);
                        setEligibilityChecked(false);
                      }}
                      placeholder={t('enter_land_size_placeholder')}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(255, 255, 255, 0.5)',
                        color: 'var(--text-dark)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Active Crop Selector */}
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-dark)' }}>
                      {t('select_active_crop')}
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => {
                        setSelectedCrop(e.target.value);
                        setEligibilityChecked(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(255, 255, 255, 0.5)',
                        color: 'var(--text-dark)',
                        fontSize: '14px',
                        outline: 'none',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '16px'
                      }}
                    >
                      <option value="">-- {t('select_crop_placeholder')} --</option>
                      {cropList.map((crop) => (
                        <option key={crop.id} value={crop.id}>
                          {lang === 'hi' ? crop.labelHi : crop.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    onClick={() => setEligibilityChecked(true)}
                    style={{
                      flex: 2,
                      padding: '12px',
                      background: 'var(--primary-green)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t('check_eligibility_btn')}
                  </button>
                  {eligibilityChecked && (
                    <button
                      onClick={handleClearCalculator}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.05)',
                        color: 'var(--text-dark)',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'hi' ? 'साफ़ करें' : 'Clear'}
                    </button>
                  )}
                </div>

                {/* Score Summary Box if checked */}
                {eligibilityChecked && (
                  <div 
                    className="scale-in"
                    style={{ 
                      background: 'rgba(16,185,129,0.06)', 
                      border: '1px solid rgba(16,185,129,0.15)', 
                      borderRadius: '12px', 
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--primary-green)" />
                    <span style={{ fontSize: '13px', color: 'var(--text-dark)', fontWeight: '600' }}>
                      {lang === 'hi' 
                        ? `कैलकुलेटर सक्रिय! नीचे सभी योजनाओं की पात्रता स्थिति देखें।`
                        : `Calculator active! Review matching status badges on all cards below.`
                      }
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Horizontal sliding category selector tabs */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto', 
              paddingBottom: '4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: isActive ? 'var(--primary-green)' : 'var(--card-bg)',
                    color: isActive ? 'white' : 'var(--text-dark)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none',
                    fontWeight: '600',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {lang === 'hi' ? cat.labelHi : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Dynamic Schemes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredSchemes.length === 0 ? (
              <div className="glass" style={{ padding: '40px 20px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                <Info size={40} color="var(--text-light)" style={{ margin: '0 auto 12px' }} />
                <p className="text-body" style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>
                  {lang === 'hi' ? 'इस श्रेणी में कोई योजना उपलब्ध नहीं है' : 'No schemes available in this category'}
                </p>
                <p className="text-sm" style={{ marginTop: '4px' }}>
                  {lang === 'hi' ? 'कृपया बाद में पुनः जांचें या कोई अन्य श्रेणी चुनें।' : 'Please check back later or try another category.'}
                </p>
              </div>
            ) : (
              filteredSchemes.map((scheme) => {
                const styles = getCategoryStyles(scheme.category);
                const eligibility = checkEligibility(scheme);
                
                return (
                  <div 
                    key={scheme._id} 
                    className="glass fade-in" 
                    style={{ 
                      padding: '20px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '14px',
                      borderLeft: styles.borderLeft,
                      borderTop: '1px solid var(--glass-border)',
                      borderRight: '1px solid var(--glass-border)',
                      borderBottom: '1px solid var(--glass-border)',
                      transition: 'transform 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Top Row: Category tag and Eligibility Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: '800', 
                          background: styles.badgeBg, 
                          color: styles.color, 
                          padding: '4px 10px', 
                          borderRadius: '20px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {lang === 'hi' ? scheme.categoryHindi : scheme.category}
                      </span>

                      {/* Render calculations badge if triggered */}
                      {eligibility && (
                        <div className="scale-in">
                          {eligibility === 'ELIGIBLE' && (
                            <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} /> {t('eligible_badge')}
                            </span>
                          )}
                          {eligibility === 'CHECK_DETAILS' && (
                            <span style={{ fontSize: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={13} /> {t('partially_eligible')}
                            </span>
                          )}
                          {eligibility === 'INELIGIBLE' && (
                            <span style={{ fontSize: '12px', background: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <XCircle size={13} /> {t('ineligible_badge')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-h3" style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '8px' }}>
                        {lang === 'hi' ? scheme.titleHindi : scheme.title}
                      </h3>
                      <p className="text-sm" style={{ lineHeight: 1.5, color: 'var(--text-light)' }}>
                        {lang === 'hi' ? scheme.descriptionHindi : scheme.description}
                      </p>
                    </div>

                    {/* Key Benefits highlighted container */}
                    <div 
                      style={{ 
                        background: lang === 'hi' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.04)', 
                        border: '1px dashed rgba(16, 185, 129, 0.2)',
                        padding: '12px 14px', 
                        borderRadius: '16px' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <DollarSign size={16} color="var(--primary-green-dark)" />
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', color: 'var(--primary-green-dark)' }}>
                          {lang === 'hi' ? 'मुख्य लाभ' : 'Key Benefit / Aid'}
                        </span>
                      </div>
                      <p className="text-body" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>
                        {lang === 'hi' ? scheme.benefitsHindi : scheme.benefits}
                      </p>
                    </div>

                    {/* Criteria information section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>
                          <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>{t('min_land_req')}</span> {scheme.minLandAcres} {t('acres')}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>
                          <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>{t('max_land_req')}</span> {scheme.maxLandAcres} {t('acres')}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-dark)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          {t('eligible_crops_req')}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>
                          {scheme.eligibleCrops && scheme.eligibleCrops.length > 0 
                            ? scheme.eligibleCrops.map(c => lang === 'hi' && c === 'Wheat' ? 'गेहूं' : lang === 'hi' && c === 'Mustard' ? 'सरसों' : lang === 'hi' && c === 'Tomato' ? 'टमाटर' : lang === 'hi' && c === 'Potato' ? 'आलू' : c).join(', ')
                            : t('all_crops')
                          }
                        </span>
                      </div>
                    </div>

                    {/* Dual Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      {/* Ask AI Assistant Guide */}
                      <button
                        onClick={() => handleAskAI(scheme)}
                        style={{
                          flex: 1,
                          padding: '12px 14px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          color: 'var(--primary-green-dark)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {t('how_to_apply_ai')}
                      </button>

                      {/* Official Portal Redirect */}
                      <button 
                        onClick={() => window.open(scheme.url, '_blank')}
                        style={{ 
                          flex: 1,
                          padding: '12px 14px', 
                          background: 'var(--primary-green)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '12px', 
                          fontWeight: 'bold', 
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.15)'
                        }}
                      >
                        {t('apply_now')} <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
        </div>
      )}
    </PageTransition>
  );
}
