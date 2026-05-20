import { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function Scanner() {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleGalleryClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsScanning(true);
      
      // Simulate scanning process
      setTimeout(() => {
        setIsScanning(false);
      }, 3000);
    }
  };

  return (
    <PageTransition>
      <div className="page-header">
        <h1 className="page-title">Disease Scanner</h1>
        <p className="page-desc">Take a photo of your crop to detect diseases instantly</p>
      </div>

      <div className="glass" style={{ 
        height: '300px', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        border: '2px dashed var(--primary-green)',
        marginBottom: '24px',
        background: selectedImage ? 'black' : 'rgba(16, 185, 129, 0.05)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {selectedImage ? (
          <>
            <img src={selectedImage} alt="Crop scan" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isScanning ? 0.6 : 1 }} />
            {isScanning && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontWeight: 'bold', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                Scanning AI...
              </div>
            )}
            {!isScanning && (
              <div style={{ position: 'absolute', bottom: '20px', background: '#059669', color: 'white', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}>
                Healthy Crop Detected!
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--primary-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>
              <Camera size={40} />
            </div>
            <div className="text-h3" style={{ color: 'var(--primary-green-dark)' }}>Tap to Scan</div>
            <div className="text-sm" style={{ marginTop: '8px' }}>or upload from gallery</div>
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
        <button onClick={handleGalleryClick} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-dark)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
          <Upload size={20} /> Gallery
        </button>
      </div>

      <h3 className="text-h3" style={{ marginBottom: '16px' }}>Recent Scans</h3>
      <div className="glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
          <AlertCircle size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="text-body" style={{ fontWeight: 700 }}>Wheat Rust Detected</div>
          <div className="text-sm">Scanned 2 days ago</div>
        </div>
        <button style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>View Fix</button>
      </div>

      <div className="glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
          <CheckCircle2 size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="text-body" style={{ fontWeight: 700 }}>Healthy Mustard</div>
          <div className="text-sm">Scanned 1 week ago</div>
        </div>
      </div>

    </PageTransition>
  );
}
