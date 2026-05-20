import { useState, useEffect } from 'react';
import { FileText, Award, Settings, HelpCircle, Phone, LogOut, MapPin, Search, Plus, Trash2, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const userName = localStorage.getItem('registeredName') || 'Pawan Kumar';
  const phone = localStorage.getItem('registeredPhone') || '+91 78518 76776';

  // State for location manager
  const [showLocationsManager, setShowLocationsManager] = useState(false);
  const [savedLocations, setSavedLocations] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Initialize and load locations from localStorage
  const loadLocations = () => {
    const defaultLocation = { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873 };
    
    // Load saved locations
    const storedSaved = localStorage.getItem('savedLocations');
    let parsedSaved = [];
    if (storedSaved) {
      try {
        parsedSaved = JSON.parse(storedSaved);
      } catch (e) {
        parsedSaved = [defaultLocation];
      }
    } else {
      parsedSaved = [defaultLocation];
      localStorage.setItem('savedLocations', JSON.stringify(parsedSaved));
    }
    setSavedLocations(parsedSaved);

    // Load active location
    const storedActive = localStorage.getItem('activeLocation');
    let parsedActive = null;
    if (storedActive) {
      try {
        parsedActive = JSON.parse(storedActive);
      } catch (e) {
        parsedActive = defaultLocation;
      }
    } else {
      parsedActive = defaultLocation;
      localStorage.setItem('activeLocation', JSON.stringify(parsedActive));
    }
    setActiveLocation(parsedActive);
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const menuItems = [
    { icon: FileText, label: t('my_crops') },
    { icon: Award, label: t('govt_schemes'), path: '/schemes' },
    { icon: MapPin, label: t('manage_locations'), action: () => setShowLocationsManager(true) },
    { icon: Settings, label: t('app_settings') },
    { icon: HelpCircle, label: t('help_support') },
    { icon: Phone, label: t('kissan_call_center') },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  // Search/Geocode locations using OpenWeather Map API
  const handleSearchLocations = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      if (!apiKey || apiKey === 'your_weather_api_key_here') {
        // Mock search data for simulation if API Key is not set or placeholder
        setTimeout(() => {
          const mocks = [
            { name: 'Jodhpur, Rajasthan', lat: 26.2389, lon: 73.0243 },
            { name: 'Udaipur, Rajasthan', lat: 24.5854, lon: 73.7125 },
            { name: 'Sikar, Rajasthan', lat: 27.6119, lon: 75.1398 },
            { name: 'Kota, Rajasthan', lat: 25.2138, lon: 75.8648 },
            { name: 'Mumbai, Maharashtra', lat: 19.0760, lon: 72.8777 }
          ];
          const filtered = mocks.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
          if (filtered.length === 0) {
            setSearchError(t('no_matching_place'));
          }
          setIsSearching(false);
        }, 800);
        return;
      }

      // Call Geocoding API, limited to India (IN)
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery.trim())},IN&limit=5&appid=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.length > 0) {
        const formatted = data.map(item => ({
          name: `${item.name}${item.state ? ', ' + item.state : ''}`,
          lat: item.lat,
          lon: item.lon
        }));
        setSearchResults(formatted);
      } else {
        setSearchError(t('no_matching_place'));
      }
    } catch (err) {
      console.error(err);
      setSearchError(t('search_failed'));
    } finally {
      setIsSearching(false);
    }
  };

  // Add a searched location to Saved list
  const handleAddLocation = (loc) => {
    // Check if duplicate
    const exists = savedLocations.some(item => 
      Math.abs(item.lat - loc.lat) < 0.01 && Math.abs(item.lon - loc.lon) < 0.01
    );
    if (exists) {
      alert(t('duplicate_location'));
      return;
    }

    const updatedList = [...savedLocations, loc];
    setSavedLocations(updatedList);
    localStorage.setItem('savedLocations', JSON.stringify(updatedList));

    // If it's the second location, or if we want to immediately set it active
    // We keep active location as is, but we let them select it manually.
    // Clear search results
    setSearchResults([]);
    setSearchQuery('');
  };

  // Select a location as active
  const handleSelectActive = (loc) => {
    setActiveLocation(loc);
    localStorage.setItem('activeLocation', JSON.stringify(loc));
    // Dispatch storage event to alert other windows/tabs instantly
    window.dispatchEvent(new Event('storage'));
  };

  // Remove a saved location
  const handleRemoveLocation = (loc, event) => {
    event.stopPropagation(); // prevent setting active when clicking delete button
    
    if (savedLocations.length <= 1) {
      alert(t('min_one_location'));
      return;
    }

    const updatedList = savedLocations.filter(item => 
      !(item.lat === loc.lat && item.lon === loc.lon)
    );
    setSavedLocations(updatedList);
    localStorage.setItem('savedLocations', JSON.stringify(updatedList));

    // If we deleted the active location, select a new one
    if (activeLocation && activeLocation.lat === loc.lat && activeLocation.lon === loc.lon) {
      const newActive = updatedList[0];
      setActiveLocation(newActive);
      localStorage.setItem('activeLocation', JSON.stringify(newActive));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <PageTransition>
      {!showLocationsManager ? (
        <>
          {/* Profile Overview Card */}
          <div className="glass" style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '40px', background: 'var(--primary-green-light)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              fontSize: '32px', fontWeight: 'bold', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-h2" style={{ marginBottom: '4px' }}>{userName}</h2>
            <p className="text-sm" style={{ marginBottom: '16px' }}>{phone}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <div style={{ background: 'var(--bg-color)', padding: '8px 16px', borderRadius: '12px' }}>
                <div className="text-h3" style={{ color: 'var(--primary-green)' }}>12</div>
                <div className="text-sm" style={{ fontSize: '12px' }}>{t('acres')}</div>
              </div>
              <div style={{ background: 'var(--bg-color)', padding: '8px 16px', borderRadius: '12px' }}>
                <div className="text-h3" style={{ color: 'var(--primary-green)' }}>3</div>
                <div className="text-sm" style={{ fontSize: '12px' }}>{t('crops')}</div>
              </div>
            </div>
          </div>

          {/* Profile Options List */}
          <div className="glass" style={{ overflow: 'hidden', marginBottom: '24px' }}>
            {menuItems.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.path) navigate(item.path);
                }}
                style={{ 
                  padding: '16px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  borderBottom: idx < menuItems.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <item.icon size={20} color="var(--primary-green)" />
                <span className="text-body" style={{ fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: '#fee2e2', 
              color: '#ef4444', 
              border: '1px solid #fca5a5', 
              borderRadius: '16px', 
              fontWeight: 'bold', 
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            <LogOut size={20} />
            {t('log_out')}
          </button>
        </>
      ) : (
        /* Locations Manager Overlay Sub-Screen */
        <div className="locations-manager-screen fade-in">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button 
              onClick={() => setShowLocationsManager(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
            >
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-h2" style={{ margin: 0, color: 'var(--primary-green-dark)' }}>{t('manage_locations')}</h2>
          </div>

          {/* Search Box */}
          <div className="glass" style={{ padding: '16px', marginBottom: '24px' }}>
            <h3 className="text-h3" style={{ fontSize: '15px', marginBottom: '12px' }}>{t('add_new_location')}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'white', 
                padding: '4px 12px',
                borderRadius: '12px', 
                border: '1px solid var(--glass-border)' 
              }}>
                <Search size={18} color="var(--text-light)" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchLocations(); }}
                  placeholder={t('search_placeholder')}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent', padding: '8px 0' }}
                />
              </div>
              <button 
                onClick={handleSearchLocations}
                style={{ 
                  background: 'var(--primary-green)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                }}
              >
                {t('search')}
              </button>
            </div>

            {/* Searching State */}
            {isSearching && (
              <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--primary-green)', fontWeight: '600', fontSize: '14px' }}>
                {t('searching')}
              </div>
            )}

            {/* Search Error */}
            {searchError && (
              <div style={{ marginTop: '16px', color: 'red', fontSize: '13px', fontWeight: '500' }}>
                {searchError}
              </div>
            )}

            {/* Search Results List */}
            {searchResults.length > 0 && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {searchResults.map((item, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      padding: '12px', 
                      background: 'rgba(255,255,255,0.7)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      border: '1px solid rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--primary-green)" />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</span>
                    </div>
                    <button 
                      onClick={() => handleAddLocation(item)}
                      style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        color: 'var(--primary-green)', 
                        border: 'none', 
                        padding: '6px', 
                        borderRadius: '50%', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Locations List */}
          <div className="glass" style={{ padding: '20px' }}>
            <h3 className="text-h3" style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--primary-green-dark)', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <MapPin size={18} />
              {t('saved_locations')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savedLocations.map((item, idx) => {
                const isActive = activeLocation && activeLocation.name === item.name;
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectActive(item)}
                    style={{ 
                      padding: '16px', 
                      borderRadius: '16px', 
                      background: isActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.6)', 
                      border: isActive ? '1.5px solid var(--primary-green)' : '1px solid rgba(0,0,0,0.03)',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {isActive ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-green)', color: 'white' }}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--text-light)' }} />
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? 'var(--primary-green-dark)' : 'var(--text-dark)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px', fontWeight: '500' }}>
                          Lat: {item.lat.toFixed(3)}, Lon: {item.lon.toFixed(3)}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => handleRemoveLocation(item, e)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: 'red', 
                        opacity: savedLocations.length <= 1 ? 0.3 : 0.8,
                        padding: '6px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      disabled={savedLocations.length <= 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
