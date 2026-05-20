import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle2, X, FileText, ChevronRight, Activity } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

export default function Scanner() {
  const fileInputRef = useRef(null);
  const { t, lang } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [selectedScanDetail, setSelectedScanDetail] = useState(null);
  const [error, setError] = useState(null);
  
  const farmerPhone = localStorage.getItem('registeredPhone') || '9876543210';

  // Load recent scans on mount
  const fetchRecentScans = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/scan?phone=${encodeURIComponent(farmerPhone)}`);
      if (res.ok) {
        const data = await res.json();
        setRecentScans(data);
      }
    } catch (err) {
      console.error('Error fetching scan history:', err);
    }
  };

  useEffect(() => {
    fetchRecentScans();
  }, [farmerPhone]);

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSelectedImage(base64String);
        triggerScanAPI(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScanAPI = async (base64Image) => {
    setIsScanning(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmerPhone,
          cropPhoto: base64Image
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Automatically open the detail modal for the new scan results
        setSelectedScanDetail(data.scan);
        fetchRecentScans();
      } else {
        setError(data.error || t('scan_failed_alert'));
      }
    } catch (err) {
      console.error('Scan API error:', err);
      setError(t('scan_failed_alert'));
    } finally {
      setIsScanning(false);
      setSelectedImage(null);
    }
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      if (lang === 'hi') {
        return d.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  // Custom high-fidelity parser to convert AI markdown into premium styled HTML blocks
  const renderRemedyText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={idx} style={{ height: '8px' }} />;

      // Match headers (### or ##)
      if (cleanLine.startsWith('###') || cleanLine.startsWith('##')) {
        const title = cleanLine.replace(/^(###|##)\s*/, '');
        return (
          <h4 key={idx} style={{ 
            color: 'var(--primary-green-dark)', 
            marginTop: '16px', 
            marginBottom: '8px', 
            fontSize: '16px', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Activity size={16} /> {title}
          </h4>
        );
      }

      // Match list items starting with '-' or '*' or '1.', '2.'
      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        const itemText = cleanLine.replace(/^[-*]\s*/, '');
        // Highlight bold text parts inside item
        return (
          <div key={idx} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '8px', 
            marginBottom: '8px', 
            fontSize: '14px', 
            lineHeight: '1.5',
            color: 'var(--text-dark)'
          }}>
            <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '16px', marginTop: '-2px' }}>•</span>
            <span>{parseInlineBold(itemText)}</span>
          </div>
        );
      }

      // Match bold line
      if (cleanLine.startsWith('**') && cleanLine.endsWith('**')) {
        return (
          <div key={idx} style={{ fontWeight: '700', color: 'var(--text-dark)', marginTop: '12px', marginBottom: '6px', fontSize: '15px' }}>
            {cleanLine.replace(/\*\*/g, '')}
          </div>
        );
      }

      return (
        <p key={idx} style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          color: 'var(--text-dark)', 
          marginBottom: '8px' 
        }}>
          {parseInlineBold(cleanLine)}
        </p>
      );
    });
  };

  // Helper to render **bold text** sections within a paragraph block
  const parseInlineBold = (text) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      // Every odd element is wrapped in double stars, so we render as bold
      if (index % 2 === 1) {
        return <strong key={index} style={{ fontWeight: '700', color: 'var(--primary-green-dark)' }}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <PageTransition>
      {/* Stylesheet injector for laser scanner animation */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        .laser-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(180deg, rgba(16, 185, 129, 0) 0%, #10b981 50%, rgba(16, 185, 129, 0) 100%);
          box-shadow: 0 0 12px #10b981, 0 0 20px #34d399;
          animation: scanLaser 3s ease-in-out infinite;
          z-index: 10;
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">{t('disease_scanner')}</h1>
        <p className="page-desc">{t('scanner_desc')}</p>
      </div>

      {/* Floating Error Bar */}
      {error && (
        <div className="glass scale-in" style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid var(--accent-red)', 
          padding: '12px 16px', 
          borderRadius: '16px', 
          color: 'var(--accent-red)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <AlertCircle size={20} />
          <span style={{ flex: 1, fontSize: '13px' }}>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Dynamic Scan Area */}
      <div 
        onClick={!isScanning ? handleGalleryClick : undefined}
        className="glass" 
        style={{ 
          height: '320px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          border: isScanning ? '2.5px solid var(--primary-green)' : '2px dashed var(--primary-green)',
          marginBottom: '24px',
          background: selectedImage || isScanning ? 'black' : 'rgba(16, 185, 129, 0.04)',
          overflow: 'hidden',
          position: 'relative',
          cursor: isScanning ? 'default' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isScanning ? '0 0 25px rgba(16, 185, 129, 0.3)' : 'var(--glass-shadow)'
        }}
      >
        {isScanning ? (
          <>
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Scanning..." 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
              />
            )}
            <div className="laser-line"></div>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              color: 'white', 
              fontWeight: '800', 
              fontSize: '20px', 
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              zIndex: 15
            }}>
              <Camera size={36} className="animate-spin" style={{ color: 'var(--primary-green-light)' }} />
              <span>{t('scanning_ai')}</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ 
              width: '84px', 
              height: '84px', 
              borderRadius: '42px', 
              background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '18px', 
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' 
            }}>
              <Camera size={42} />
            </div>
            <div className="text-h3" style={{ color: 'var(--primary-green-dark)', fontWeight: 'bold' }}>{t('tap_to_scan')}</div>
            <div className="text-sm" style={{ marginTop: '8px', color: 'var(--text-light)', fontWeight: '600' }}>{t('or_upload_gallery')}</div>
          </>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={handleGalleryClick} 
          disabled={isScanning}
          style={{ 
            flex: 1, 
            padding: '16px', 
            borderRadius: '20px', 
            border: 'none', 
            background: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px', 
            fontWeight: 700, 
            color: 'var(--primary-green-dark)', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            opacity: isScanning ? 0.6 : 1
          }}
          className="action-button-hover"
        >
          <Upload size={22} /> {t('gallery')}
        </button>
      </div>

      {/* Recent Scans Listing */}
      <h3 className="text-h3" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={22} style={{ color: 'var(--primary-green)' }} />
        <span>{t('recent_scans')}</span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
        {recentScans.length === 0 ? (
          <div className="glass" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-light)' }}>
            <AlertCircle size={36} style={{ color: 'var(--primary-green)', opacity: 0.6, marginBottom: '12px' }} />
            <div className="text-body" style={{ fontWeight: 'bold', marginBottom: '6px' }}>{t('no_scans')}</div>
          </div>
        ) : (
          recentScans.map((scan) => {
            const isHealthy = scan.diseaseName.toLowerCase().includes('healthy') || scan.diseaseName.toLowerCase().includes('स्वस्थ');
            return (
              <div 
                key={scan._id} 
                className="glass scale-in" 
                style={{ 
                  padding: '14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '14px',
                  borderLeft: isHealthy ? '5px solid #10b981' : '5px solid var(--accent-red)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Image Preview thumbnail */}
                <div style={{ width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden', background: '#e5e7eb', flexShrink: 0 }}>
                  <img src={scan.cropPhoto} alt="Scan preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-body" style={{ fontWeight: 800, color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {scan.cropName} - {scan.diseaseName}
                  </div>
                  <div className="text-sm" style={{ marginTop: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {formatDate(scan.createdAt)}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedScanDetail(scan)}
                  style={{ 
                    background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 14px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {t('view_fix')} <ChevronRight size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Premium Glassmorphic Detail Modal Overlay */}
      {selectedScanDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }} className="fade-in">
          <div className="glass scale-in" style={{
            width: '100%',
            maxWidth: '420px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            background: 'var(--card-bg)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div className="text-h3" style={{ fontWeight: '800', color: 'var(--primary-green-dark)' }}>
                {t('remedy_title')}
              </div>
              <button 
                onClick={() => setSelectedScanDetail(null)}
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-dark)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px'
            }}>
              {/* Image box */}
              <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '16px',
                border: '1.5px solid var(--glass-border)'
              }}>
                <img 
                  src={selectedScanDetail.cropPhoto} 
                  alt="Scanned item" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              {/* Crop & Disease Summary Row */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-sm" style={{ fontWeight: 'bold' }}>{selectedScanDetail.cropName}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    background: selectedScanDetail.diseaseName.toLowerCase().includes('healthy') || selectedScanDetail.diseaseName.toLowerCase().includes('स्वस्थ') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: selectedScanDetail.diseaseName.toLowerCase().includes('healthy') || selectedScanDetail.diseaseName.toLowerCase().includes('स्वस्थ') ? '#059669' : 'var(--accent-red)',
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}>
                    {selectedScanDetail.diseaseName.toLowerCase().includes('healthy') || selectedScanDetail.diseaseName.toLowerCase().includes('स्वस्थ') ? '✓ HEALTHY' : '⚠ DISEASE ALERT'}
                  </span>
                </div>
                <h2 className="text-h2" style={{ marginTop: '6px', fontSize: '20px', fontWeight: '800', color: 'var(--text-dark)' }}>
                  {selectedScanDetail.diseaseName}
                </h2>
                <div className="text-sm" style={{ fontSize: '12px', marginTop: '2px' }}>
                  {t('recent_scans')}: {formatDate(selectedScanDetail.createdAt)}
                </div>
              </div>

              {/* Parsed remedy instructions */}
              <div style={{
                background: 'rgba(255,255,255,0.4)',
                padding: '16px',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)'
              }}>
                {renderRemedyText(selectedScanDetail.remedy)}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--glass-border)',
              textAlign: 'right'
            }}>
              <button 
                onClick={() => setSelectedScanDetail(null)}
                style={{
                  background: 'var(--primary-green-dark)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
                }}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </PageTransition>
  );
}
