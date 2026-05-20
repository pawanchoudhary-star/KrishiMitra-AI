import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Sparkles, History, Droplet, Sun, Layers, Leaf, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function CropSuggest() {
  const phone = localStorage.getItem('registeredPhone') || '+91 78518 76776';

  // State Variables
  const [soilType, setSoilType] = useState('Loamy');
  const [waterLevel, setWaterLevel] = useState('Medium');
  const [season, setSeason] = useState('Rabi');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch historic suggestions
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`http://localhost:5000/api/crop-suggestions?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGetSuggestions = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setRecommendation('');

    try {
      const res = await fetch('http://localhost:5000/api/crop-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerPhone: phone,
          soilType,
          waterLevel,
          season
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendation(data.recommendation);
        fetchHistory(); // Refresh history panel
      } else {
        alert('Failed to generate suggestions. Please ensure backend server is active.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to AI suggestion server.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPastRecommendation = (pastRec) => {
    setSoilType(pastRec.soilType);
    setWaterLevel(pastRec.waterLevel);
    setSeason(pastRec.season);
    setRecommendation(pastRec.recommendation);
    setShowHistory(false);
  };

  return (
    <PageTransition>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: 'var(--text-dark)' }}>
            <ArrowLeft size={28} />
          </Link>
          <h1 className="page-title" style={{ margin: 0, color: 'var(--primary-green-dark)' }}>Kya Ugau?</h1>
        </div>

        <button 
          onClick={() => setShowHistory(!showHistory)}
          style={{
            background: 'rgba(16, 185, 129, 0.1)', 
            color: 'var(--primary-green-dark)', 
            border: 'none', 
            padding: '8px 14px', 
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <History size={16} />
          {showHistory ? 'Configure' : 'History'}
        </button>
      </div>

      <p className="page-desc" style={{ marginBottom: '24px' }}>
        Determine best-suited crops using live soil analysis, season data, and our failover AI network.
      </p>

      {/* 1. HISTORY PANEL OVERLAY */}
      {showHistory ? (
        <div className="glass fade-in" style={{ padding: '20px' }}>
          <h3 className="text-h3" style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--primary-green-dark)' }}>
            <History size={18} />
            Suggestion History
          </h3>

          {isLoadingHistory ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--primary-green)' }}>
              <Loader2 className="animate-spin" style={{ margin: '0 auto 8px' }} />
              <span>Loading records...</span>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-light)' }}>
              No history found. Generate your first suggestion!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => loadPastRecommendation(item)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'white',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="profile-menu-item"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-green-dark)' }}>
                      {item.soilType} Soil
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 'bold' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-light)', fontWeight: '500' }}>
                    <span>Water: {item.waterLevel}</span>
                    <span>Season: {item.season}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 2. QUESTIONNAIRE FORM */}
          {!recommendation && !isGenerating && (
            <form className="glass" onSubmit={handleGetSuggestions} style={{ padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Soil Type Select */}
                <div>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                    <Layers size={16} color="var(--primary-green)" />
                    Soil Profile Type
                  </label>
                  <select 
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', fontWeight: '500', color: '#1f2937' }}
                  >
                    <option value="Loamy">Loamy Soil (दोमट मिट्टी)</option>
                    <option value="Black Soil">Black Soil (काली मिट्टी)</option>
                    <option value="Clayey">Clayey Soil (चिकनी मिट्टी)</option>
                    <option value="Sandy">Sandy Soil (रेतीली मिट्टी)</option>
                    <option value="Red Soil">Red Soil (लाल मिट्टी)</option>
                  </select>
                </div>

                {/* Water Availability Select */}
                <div>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                    <Droplet size={16} color="var(--primary-green)" />
                    Water Source & Availability
                  </label>
                  <select 
                    value={waterLevel}
                    onChange={(e) => setWaterLevel(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', fontWeight: '500', color: '#1f2937' }}
                  >
                    <option value="Low">Low (Rainfed / वर्षा आधारित)</option>
                    <option value="Medium">Medium (Tube-well / नलकूप सिंचाई)</option>
                    <option value="High">High (Canal / भरपूर सिंचाई)</option>
                  </select>
                </div>

                {/* Season Select */}
                <div>
                  <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
                    <Calendar size={16} color="var(--primary-green)" />
                    Current Sowing Season
                  </label>
                  <select 
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', fontWeight: '500', color: '#1f2937' }}
                  >
                    <option value="Rabi">Rabi (Winter - सरसों, गेंहू, चना)</option>
                    <option value="Kharif">Kharif (Monsoon - धान, बाजरा, मक्का)</option>
                    <option value="Zaid">Zaid (Summer - तरबूज, सब्जियां)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  style={{
                    width: '100%', padding: '14px', borderRadius: '16px', border: 'none', 
                    background: 'var(--primary-green)', color: 'white', fontWeight: 'bold', fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.2)', marginTop: '8px'
                  }}
                >
                  <Sparkles size={18} />
                  Get AI Recommendations
                </button>

              </div>
            </form>
          )}

          {/* 3. GENERATING/LOADING AI INTERFACE */}
          {isGenerating && (
            <div className="glass fade-in" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--primary-green)' }}>
              <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto 16px' }} />
              <h3 className="text-h3" style={{ marginBottom: '8px' }}>Consulting KrishiMitra AI...</h3>
              <p className="text-sm" style={{ color: 'var(--text-light)' }}>
                Analyzing {soilType} Soil parameters and matching best crop returns...
              </p>
            </div>
          )}

          {/* 4. RESULT SHEET DISPLAY */}
          {recommendation && !isGenerating && (
            <div className="scale-in">
              <div 
                className="glass" 
                style={{ 
                  padding: '24px', 
                  border: '2px solid var(--primary-green)', 
                  marginBottom: '20px',
                  background: 'var(--card-bg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={22} color="var(--primary-green)" />
                    <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary-green-dark)' }}>AI Tailored Suggestion</span>
                  </div>
                  <span style={{ fontSize: '11px', background: '#ecfdf5', color: 'var(--primary-green-dark)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                    Active
                  </span>
                </div>

                <div 
                  className="ai-suggestion-text"
                  style={{ 
                    fontSize: '14px', 
                    lineHeight: 1.6, 
                    color: 'var(--text-dark)', 
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {recommendation}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                  <button
                    onClick={() => setRecommendation('')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)',
                      background: 'transparent', color: 'var(--text-dark)', fontWeight: 'bold', cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Configure Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </PageTransition>
  );
}
