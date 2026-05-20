import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Leaf, TrendingUp, MessageSquare, CloudRain, Sun, Cloud, MapPin, Languages } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [userName, setUserName] = useState('Kisan');
  const [greeting, setGreeting] = useState('');
  const [weather, setWeather] = useState({ temp: '...', desc: 'Loading weather...' });
  const [icon, setIcon] = useState('cloud');
  const { lang, toggleLanguage, t } = useLanguage();

  // Locations states
  const [savedLocations, setSavedLocations] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);

  // Helper for translating weather description
  const getWeatherDesc = (desc, currentLang) => {
    const mapping = {
      'en': {
        'clear sky': 'Clear Sky',
        'few clouds': 'Few Clouds',
        'scattered clouds': 'Scattered Clouds',
        'broken clouds': 'Broken Clouds',
        'shower rain': 'Showers Expected',
        'rain': 'Rainy Weather',
        'thunderstorm': 'Thunderstorms',
        'snow': 'Snowy',
        'mist': 'Misty / Foggy',
        'haze': 'Hazy Weather',
        'overcast clouds': 'Overcast Clouds',
        'light rain': 'Light Rain',
        'moderate rain': 'Moderate Rain',
        'heavy intensity rain': 'Heavy Rain',
      },
      'hi': {
        'clear sky': 'साफ़ आसमान (धूप)',
        'few clouds': 'हल्के बादल',
        'scattered clouds': 'आंशिक रूप से बादल',
        'broken clouds': 'बादल छाए रहेंगे',
        'shower rain': 'बूंदाबांदी की संभावना',
        'rain': 'बारिश का मौसम',
        'thunderstorm': 'आंधी-तूफान',
        'snow': 'बर्फबारी',
        'mist': 'धुंध और कोहरा',
        'haze': 'हल्की धुंध',
        'overcast clouds': 'घने बादल',
        'light rain': 'हल्की बारिश',
        'moderate rain': 'मध्यम बारिश',
        'heavy intensity rain': 'भारी बारिश',
      }
    };
    const lower = (desc || '').toLowerCase();
    return mapping[currentLang]?.[lower] || desc;
  };

  // Initialize and load locations from localStorage
  const loadLocations = () => {
    const defaultLocation = { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873 };
    
    // Load saved list
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
    const name = localStorage.getItem('registeredName') || 'Kisan';
    setUserName(name);
  }, []);

  // Sync state whenever window is focused or storage event fires
  useEffect(() => {
    const handleStorageChange = () => {
      loadLocations();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('good_morning'));
    else if (hour < 18) setGreeting(t('good_afternoon'));
    else setGreeting(t('good_evening'));
  }, [lang, t]);

  // Fetch weather when active location or API key changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!activeLocation) return;
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey || apiKey === 'your_weather_api_key_here') {
          setWeather({ temp: '28°C', desc: t('light_rain') });
          setIcon('cloudRain');
          return;
        }
        
        const { lat, lon } = activeLocation;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.main) {
          const rawDesc = data.weather[0].description;
          setWeather({
            temp: `${Math.round(data.main.temp)}°C`,
            desc: getWeatherDesc(rawDesc, lang)
          });
          const mainWeather = data.weather[0].main.toLowerCase();
          if (mainWeather.includes('clear')) {
             setIcon('sun');
          } else if (mainWeather.includes('cloud')) {
             setIcon('cloud');
          } else {
             setIcon('cloudRain');
          }
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };
    fetchWeather();
  }, [activeLocation, lang]);

  // Handler to switch active location
  const handleSwitchLocation = (loc) => {
    setActiveLocation(loc);
    localStorage.setItem('activeLocation', JSON.stringify(loc));
    // Dispatch a storage event to alert other instances/tabs
    window.dispatchEvent(new Event('storage'));
  };

  const cards = [
    {
      title: t('kya_ugau'),
      subtitle: t('crop_suggest'),
      icon: Sprout,
      color: '#10b981',
      bg: '#d1fae5',
      path: '/crop-suggest'
    },
    {
      title: t('crop_care'),
      subtitle: t('smart_diagnosis'),
      icon: Leaf,
      color: '#059669',
      bg: '#ecfdf5',
      path: '/crop-care'
    },
    {
      title: t('mandi_price'),
      subtitle: t('live_rates'),
      icon: TrendingUp,
      color: '#fbbf24',
      bg: '#fef3c7',
      path: '/sell'
    },
    {
      title: t('ask_ai'),
      subtitle: t('voice_assistant'),
      icon: MessageSquare,
      color: '#3b82f6',
      bg: '#dbeafe',
      path: '/chat'
    }
  ];

  return (
    <PageTransition>
      <header className="app-header">
        <div className="user-profile-mini">
          <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }} />
          <div>
            <div className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-green-dark)', fontWeight: 'bold' }}>
              <MapPin size={12} />
              <span>{activeLocation ? activeLocation.name : 'Jaipur, Rajasthan'}</span>
            </div>
            <div className="text-h3">{greeting}, {userName}!</div>
          </div>
        </div>
        
        <button 
          onClick={toggleLanguage}
          style={{ 
            background: 'white', 
            border: '1px solid var(--glass-border)', 
            padding: '8px 12px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            color: 'var(--primary-green-dark)'
          }}
        >
          <Languages size={20} />
          <span style={{ fontWeight: 'bold' }}>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>
      </header>

      {/* Weather Widget */}
      <div className="info-widget glass" style={{ borderLeft: '5px solid var(--primary-green)', marginBottom: '8px' }}>
        <div className="info-item">
          <div className="info-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-green)' }}>
            {icon === 'sun' ? <Sun size={26} /> : icon === 'cloud' ? <Cloud size={26} /> : <CloudRain size={26} />}
          </div>
          <div>
            <div className="text-h3" style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-dark)' }}>
              {weather.temp}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-light)', fontWeight: '500' }}>
              {weather.desc}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>
          {activeLocation ? activeLocation.name.split(',')[0] : 'Jaipur'}
        </div>
      </div>

      {/* Horizontal Quick Location Switcher */}
      {savedLocations.length > 1 && (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          padding: '4px 0 16px 0',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} className="quick-location-switcher">
          {savedLocations.map((loc, idx) => {
            const isActive = activeLocation && activeLocation.name === loc.name;
            return (
              <button
                key={idx}
                onClick={() => handleSwitchLocation(loc)}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: isActive ? '1.5px solid var(--primary-green)' : '1px solid var(--glass-border)',
                  background: isActive ? 'linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)' : 'white',
                  color: isActive ? 'white' : 'var(--text-dark)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 10px rgba(16, 185, 129, 0.25)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease'
                }}
              >
                {loc.name.split(',')[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* Margin helper if no switcher bar */}
      {savedLocations.length <= 1 && <div style={{ height: '12px' }} />}

      <div className="cards-grid">
        {cards.map((card, idx) => (
          <Link to={card.path} key={idx} className="action-card glass">
            <div className="card-icon-wrapper" style={{ backgroundColor: card.bg, color: card.color }}>
              <card.icon size={28} />
            </div>
            <div>
              <div className="card-title">{card.title}</div>
              <div className="card-subtitle">{card.subtitle}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="text-h3">{t('govt_schemes')}</div>
          <Link to="/schemes" style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}>View All</Link>
        </div>
        <div className="action-card glass" style={{ padding: '16px', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div className="text-body" style={{ fontWeight: 700 }}>PM Kisan Samman Nidhi</div>
            <div className="text-sm" style={{ marginTop: '4px' }}>Get up to ₹6,000 per year</div>
          </div>
          <button 
            onClick={() => window.open('https://pmkisan.gov.in/', '_blank')}
            style={{ 
              background: 'var(--primary-green)', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t('apply')}
          </button>
        </div>
        <div style={{ marginTop: '12px' }}>
          <Link to="/schemes" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '12px', background: 'white', color: 'var(--primary-green-dark)', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', border: '1px solid var(--glass-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            Show Related Government Schemes
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
