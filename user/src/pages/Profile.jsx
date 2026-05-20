import { useState, useEffect } from 'react';
import { 
  FileText, Award, Settings, HelpCircle, Phone, LogOut, MapPin, 
  Search, Plus, Trash2, ArrowLeft, Check, Sun, Moon, Bell, 
  Globe, ChevronDown, ChevronUp, Calendar, Info, ShieldAlert 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

const localT = {
  en: {
    crops_manager: 'My Crops Manager',
    add_crop: 'Add New Crop',
    crop_name: 'Crop Name',
    sowing_date: 'Sowing Date',
    area_acres: 'Area (Acres)',
    health_status: 'Health Status',
    saving: 'Saving...',
    save_crop: 'Save Crop',
    no_crops: 'No crops registered. Add your first crop above!',
    days_since: 'days since sowing',
    sown_today: 'Sown today',
    harvested: 'Crop entry removed successfully!',
    delete_confirm: 'Are you sure you want to remove this crop?',
    
    settings: 'App Settings',
    dark_mode: 'Dark Mode',
    language: 'App Language',
    notifications: 'Push Notifications',
    enabled: 'Enabled',
    disabled: 'Disabled',
    
    support: 'Help & Support Hub',
    faq_title: 'Frequently Asked Questions (FAQs)',
    file_ticket: 'Submit a Support Ticket',
    ticket_category: 'Ticket Category',
    issue_desc: 'Describe your issue/query in detail...',
    submit_ticket: 'Submit Ticket',
    submitting: 'Submitting...',
    ticket_success: 'Support ticket submitted successfully! Our expert will review it and call you.',
    select_category: 'Select Category',
    cat_weather: 'Weather Forecast',
    cat_mandi: 'Mandi Rates',
    cat_seeds: 'Seed Selection',
    cat_disease: 'Crop Disease Alert',
    cat_other: 'Other Support Query',
    
    call_center: 'Kissan Call Center',
    call_center_desc: 'Government of India\'s official toll-free helpline for farmers.',
    toll_free: 'Toll-Free Helpline',
    timings: 'Timings',
    timings_val: '6:00 AM to 10:00 PM (All 365 Days)',
    call_now: 'Call Now',
    close: 'Close',
  },
  hi: {
    crops_manager: 'मेरी फसल प्रबंधक',
    add_crop: 'नई फसल जोड़ें',
    crop_name: 'फसल का नाम',
    sowing_date: 'बुवाई की तारीख',
    area_acres: 'क्षेत्रफल (एकड़)',
    health_status: 'स्वास्थ्य स्थिति',
    saving: 'सहेजा जा रहा है...',
    save_crop: 'फसल सहेजें',
    no_crops: 'कोई फसल दर्ज नहीं है। ऊपर अपनी पहली फसल जोड़ें!',
    days_since: 'दिन बुवाई से हो गए',
    sown_today: 'आज ही बुवाई हुई',
    harvested: 'फसल प्रविष्टि सफलतापूर्वक हटा दी गई!',
    delete_confirm: 'क्या आप वाकई इस फसल को हटाना चाहते हैं?',
    
    settings: 'ऐप सेटिंग्स',
    dark_mode: 'डार्क मोड',
    language: 'ऐप की भाषा',
    notifications: 'पुश नोटिफिकेशन',
    enabled: 'चालू',
    disabled: 'बंद',
    
    support: 'सहायता और समर्थन हब',
    faq_title: 'अक्सर पूछे जाने वाले प्रश्न (FAQs)',
    file_ticket: 'समर्थन टिकट जमा करें',
    ticket_category: 'टिकट की श्रेणी',
    issue_desc: 'अपनी समस्या/प्रश्न का विस्तार से वर्णन करें...',
    submit_ticket: 'टिकट जमा करें',
    submitting: 'जमा किया जा रहा है...',
    ticket_success: 'सहायता टिकट सफलतापूर्वक जमा हो गया! हमारे विशेषज्ञ इसकी समीक्षा करके आपको कॉल करेंगे।',
    select_category: 'श्रेणी चुनें',
    cat_weather: 'मौसम पूर्वानुमान',
    cat_mandi: 'मंडी भाव',
    cat_seeds: 'बीज चयन',
    cat_disease: 'फसल रोग चेतावनी',
    cat_other: 'अन्य सहायता प्रश्न',
    
    call_center: 'किसान कॉल सेंटर',
    call_center_desc: 'किसानों के लिए भारत सरकार की आधिकारिक टोल-फ्री हेल्पलाइन।',
    toll_free: 'टोल-फ्री हेल्पलाइन',
    timings: 'समय',
    timings_val: 'सुबह 6:00 बजे से रात 10:00 बजे तक (सभी 365 दिन)',
    call_now: 'अभी कॉल करें',
    close: 'बंद करें',
  }
};

const faqs = {
  en: [
    { q: "How can I check weather alerts?", a: "Navigate to the 'Alerts' tab from the bottom navigation bar to view real-time warnings, rainfall forecasts, and temperature alerts for your active location." },
    { q: "How do I sell my crops directly?", a: "Go to the 'Sell' tab in the bottom bar, select your crop, specify the quantity, upload an optional photo of the crop, and submit. Our partner institutions will buy directly from you." },
    { q: "How can I change my farming location?", a: "Go to Profile -> 'Manage Locations'. You can search for your village, district, or city in India and select it as active. This updates weather forecasts and mandi prices automatically." },
    { q: "How does the Crop Care Smart Diagnosis work?", a: "Click on the 'Scan' tab, allow camera access to take a photo of the infected crop leaf, and KrishiMitra AI will diagnose the disease and suggest organic/chemical remedies instantly." }
  ],
  hi: [
    { q: "मैं मौसम के अलर्ट कैसे देख सकता हूँ?", a: "अपने सक्रिय स्थान के लिए वास्तविक समय की चेतावनियों, वर्षा के पूर्वानुमान और तापमान के अलर्ट देखने के लिए नीचे दिए गए नेविगेशन बार से 'अलर्ट्स' टैब पर जाएं।" },
    { q: "मैं अपनी फसलें सीधे कैसे बेचूँ?", a: "नीचे दिए गए बार में 'मंडी/बेचें' टैब पर जाएं, अपनी फसल चुनें, मात्रा दर्ज करें, फसल की एक वैकल्पिक फोटो अपलोड करें और सबमिट करें। हमारे भागीदार संस्थान सीधे आपसे खरीदेंगे।" },
    { q: "मैं अपना खेती का स्थान (लोकेशन) कैसे बदलूँ?", a: "प्रोफ़ाइल -> 'लोकेशन प्रबंधित करें' पर जाएं। आप भारत में अपने गाँव, जिले या शहर को खोज सकते हैं और इसे सक्रिय कर सकते हैं। इससे मौसम और मंडी के भाव अपने आप अपडेट हो जाएंगे।" },
    { q: "फसल देखभाल स्मार्ट निदान (स्मार्ट स्कैन) कैसे काम करता है?", a: "नीचे 'स्कैन' टैब पर क्लिक करें, संक्रमित पत्ती की फोटो लेने के लिए कैमरा एक्सेस की अनुमति दें, और कृषि मित्र AI तुरंत बीमारी का निदान करके उपचार सुझाएगा।" }
  ]
};

export default function Profile() {
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const userName = localStorage.getItem('registeredName') || 'Pawan Kumar';
  const phone = localStorage.getItem('registeredPhone') || '+91 78518 76776';

  // Screen/Overlay States
  const [showLocationsManager, setShowLocationsManager] = useState(false);
  const [showCropsManager, setShowCropsManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupportHub, setShowSupportHub] = useState(false);
  const [showKissanCallCenter, setShowKissanCallCenter] = useState(false);

  // Manage Locations state
  const [savedLocations, setSavedLocations] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Crops manager states
  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [addingCrop, setAddingCrop] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropArea, setNewCropArea] = useState('');
  const [newSowingDate, setNewSowingDate] = useState('');
  const [newHealthStatus, setNewHealthStatus] = useState('Healthy');
  
  // Settings States
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') !== 'false'
  );

  // Support states
  const [supportCategory, setSupportCategory] = useState('');
  const [supportDesc, setSupportDesc] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Sync theme state on load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.body.classList.toggle('dark-theme', storedTheme === 'dark');
  }, []);

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

  // Fetch farmer's crops from backend
  const fetchCrops = async () => {
    setLoadingCrops(true);
    try {
      const res = await fetch(`http://localhost:5000/api/crops?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setCrops(data);
      }
    } catch (err) {
      console.error('Error fetching crops:', err);
    } finally {
      setLoadingCrops(false);
    }
  };

  useEffect(() => {
    if (showCropsManager) {
      fetchCrops();
    }
  }, [showCropsManager]);

  const menuItems = [
    { icon: FileText, label: t('my_crops'), action: () => setShowCropsManager(true) },
    { icon: Award, label: t('govt_schemes'), path: '/schemes' },
    { icon: MapPin, label: t('manage_locations'), action: () => setShowLocationsManager(true) },
    { icon: Settings, label: t('app_settings'), action: () => setShowSettings(true) },
    { icon: HelpCircle, label: t('help_support'), action: () => setShowSupportHub(true) },
    { icon: Phone, label: t('kissan_call_center'), action: () => setShowKissanCallCenter(true) },
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

  // Add new crop handler
  const handleAddCrop = async (e) => {
    e.preventDefault();
    if (!newCropName || !newCropArea || !newSowingDate) {
      alert('Please fill all details!');
      return;
    }

    setAddingCrop(true);
    try {
      const res = await fetch('http://localhost:5000/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: newCropName,
          sowingDate: new Date(newSowingDate),
          area: parseFloat(newCropArea),
          healthStatus: newHealthStatus,
          farmerPhone: phone
        })
      });

      if (res.ok) {
        setNewCropName('');
        setNewCropArea('');
        setNewSowingDate('');
        setNewHealthStatus('Healthy');
        fetchCrops();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add crop');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to database');
    } finally {
      setAddingCrop(false);
    }
  };

  // Delete/harvest crop entry
  const handleDeleteCrop = async (id) => {
    if (!window.confirm(localT[lang].delete_confirm)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/crops/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchCrops();
      } else {
        alert('Failed to remove crop entry');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting crop');
    }
  };

  // Toggle Dark Mode
  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };

  // Toggle push notifications
  const handleToggleNotifications = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    localStorage.setItem('notificationsEnabled', newVal.toString());
  };

  // Submit support ticket
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!supportCategory || !supportDesc.trim()) {
      alert('Please fill in all ticket details!');
      return;
    }

    setSubmittingTicket(true);
    setTicketSuccessMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: userName,
          farmerPhone: phone,
          category: localT[lang][supportCategory] || supportCategory,
          description: supportDesc
        })
      });

      if (res.ok) {
        setSupportCategory('');
        setSupportDesc('');
        setTicketSuccessMsg(localT[lang].ticket_success);
        setTimeout(() => setTicketSuccessMsg(''), 5000);
      } else {
        alert('Error filing support ticket');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error. Try again later.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Calculate days since sowing
  const getDaysSinceSowingText = (sowingDateStr) => {
    const diffTime = Date.now() - new Date(sowingDateStr).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return localT[lang].sown_today;
    if (diffDays < 0) return `${Math.abs(diffDays)} days until sowing`;
    return `${diffDays} ${localT[lang].days_since}`;
  };

  // Health status visual styles helper
  const getHealthBadgeStyle = (status) => {
    switch (status) {
      case 'Healthy':
      default:
        return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-green)' };
      case 'Monitored':
        return { bg: 'rgba(251, 191, 36, 0.1)', color: 'var(--accent-yellow)' };
      case 'Disease Alert':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' };
    }
  };

  return (
    <PageTransition>
      {/* 1. MAIN PROFILE SCREEN */}
      {!showLocationsManager && !showCropsManager && !showSettings && !showSupportHub && (
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
              <div style={{ background: 'var(--bg-color)', padding: '8px 16px', borderRadius: '12px', minWidth: '90px' }}>
                <div className="text-h3" style={{ color: 'var(--primary-green)' }}>Active</div>
                <div className="text-sm" style={{ fontSize: '12px' }}>Account Status</div>
              </div>
              <div style={{ background: 'var(--bg-color)', padding: '8px 16px', borderRadius: '12px', minWidth: '90px' }}>
                <div className="text-h3" style={{ color: 'var(--primary-green)' }}>IN</div>
                <div className="text-sm" style={{ fontSize: '12px' }}>Region</div>
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
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                className="profile-menu-item"
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
      )}

      {/* 2. LOCATIONS MANAGER SCREEN */}
      {showLocationsManager && (
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
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent', padding: '8px 0', color: '#1f2937' }}
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
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{item.name}</span>
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

      {/* 3. CROPS MANAGER SCREEN */}
      {showCropsManager && (
        <div className="crops-manager-screen fade-in">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button 
              onClick={() => setShowCropsManager(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
            >
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-h2" style={{ margin: 0, color: 'var(--primary-green-dark)' }}>{localT[lang].crops_manager}</h2>
          </div>

          {/* Add Crop Glass Form */}
          <form className="glass" onSubmit={handleAddCrop} style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 className="text-h3" style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--primary-green-dark)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Plus size={18} />
              {localT[lang].add_crop}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{localT[lang].crop_name}</label>
                <select 
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', color: '#1f2937' }}
                  required
                >
                  <option value="">{lang === 'en' ? '-- Select Crop --' : '-- फसल चुनें --'}</option>
                  <option value="Wheat">{lang === 'en' ? 'Wheat (गेंहू)' : 'गेंहू (Wheat)'}</option>
                  <option value="Mustard">{lang === 'en' ? 'Mustard (सरसों)' : 'सरसों (Mustard)'}</option>
                  <option value="Rice">{lang === 'en' ? 'Rice (चावल)' : 'चावल (Rice)'}</option>
                  <option value="Bajra">{lang === 'en' ? 'Bajra (बाजरा)' : 'बाजरा (Bajra)'}</option>
                  <option value="Cotton">{lang === 'en' ? 'Cotton (कपास)' : 'कपास (Cotton)'}</option>
                  <option value="Groundnut">{lang === 'en' ? 'Groundnut (मूंगफली)' : 'मूंगफली (Groundnut)'}</option>
                  <option value="Barley">{lang === 'en' ? 'Barley (जौ)' : 'जौ (Barley)'}</option>
                  <option value="Chickpea">{lang === 'en' ? 'Chickpea (चना)' : 'चना (Chickpea)'}</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{localT[lang].area_acres}</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1"
                    placeholder="e.g. 2.5" 
                    value={newCropArea} 
                    onChange={(e) => setNewCropArea(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', color: '#1f2937' }}
                    required
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{localT[lang].health_status}</label>
                  <select 
                    value={newHealthStatus}
                    onChange={(e) => setNewHealthStatus(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', color: '#1f2937' }}
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Monitored">Monitored</option>
                    <option value="Disease Alert">Disease Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{localT[lang].sowing_date}</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '12px', border: '1px solid var(--glass-border)', padding: '0 12px' }}>
                  <Calendar size={18} color="var(--text-light)" />
                  <input 
                    type="date" 
                    value={newSowingDate} 
                    onChange={(e) => setNewSowingDate(e.target.value)}
                    style={{ flex: 1, padding: '12px 8px', border: 'none', outline: 'none', background: 'transparent', color: '#1f2937' }}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={addingCrop}
                style={{ 
                  background: 'var(--primary-green)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '16px', 
                  fontWeight: 'bold', 
                  marginTop: '8px', 
                  cursor: 'pointer',
                  fontSize: '15px',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.2)'
                }}
              >
                {addingCrop ? localT[lang].saving : localT[lang].save_crop}
              </button>
            </div>
          </form>

          {/* Crops list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loadingCrops ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--primary-green)' }}>
                <div style={{ border: '3px solid #e2e8f0', borderTop: '3px solid var(--primary-green)', borderRadius: '50%', width: '32px', height: '32px', margin: '0 auto 12px' }} className="animate-spin" />
                <span>Loading crops...</span>
              </div>
            ) : crops.length === 0 ? (
              <div className="glass" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)', fontWeight: '500' }}>
                {localT[lang].no_crops}
              </div>
            ) : (
              crops.map((crop) => {
                const hStyle = getHealthBadgeStyle(crop.healthStatus);
                return (
                  <div key={crop._id} className="glass" style={{ padding: '18px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h4 className="text-h3" style={{ color: 'var(--primary-green-dark)', margin: 0 }}>{crop.cropName}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 'bold' }}>{crop.area} {t('acres')}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCrop(crop._id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'red', padding: '6px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '10px', marginTop: '6px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-dark)', fontWeight: '600' }}>
                        {getDaysSinceSowingText(crop.sowingDate)}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        background: hStyle.bg, 
                        color: hStyle.color 
                      }}>
                        {crop.healthStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. APP SETTINGS SCREEN */}
      {showSettings && (
        <div className="app-settings-screen fade-in">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button 
              onClick={() => setShowSettings(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
            >
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-h2" style={{ margin: 0, color: 'var(--primary-green-dark)' }}>{localT[lang].settings}</h2>
          </div>

          <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Theme selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {theme === 'light' ? <Sun size={20} color="orange" /> : <Moon size={20} color="var(--primary-green)" />}
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{localT[lang].dark_mode}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Premium dark glass theme</div>
                </div>
              </div>
              <button 
                onClick={handleToggleTheme}
                style={{
                  width: '54px', height: '28px', borderRadius: '15px', 
                  background: theme === 'dark' ? 'var(--primary-green)' : '#cbd5e1',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  padding: '2px', transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'white', position: 'absolute', top: '2px',
                  left: theme === 'dark' ? '28px' : '2px', transition: 'left 0.2s',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }} />
              </button>
            </div>

            {/* Language Selection */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Globe size={20} color="var(--primary-green)" />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{localT[lang].language}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Choose English or हिंदी</div>
                </div>
              </div>
              <button 
                onClick={toggleLanguage}
                style={{ 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: 'var(--primary-green)', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {lang === 'en' ? 'English (EN)' : 'हिंदी (HI)'}
              </button>
            </div>

            {/* Push Notifications Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Bell size={20} color="var(--primary-green)" />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{localT[lang].notifications}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Mandi rates & crop health alerts</div>
                </div>
              </div>
              <button 
                onClick={handleToggleNotifications}
                style={{
                  width: '54px', height: '28px', borderRadius: '15px', 
                  background: notificationsEnabled ? 'var(--primary-green)' : '#cbd5e1',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  padding: '2px', transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'white', position: 'absolute', top: '2px',
                  left: notificationsEnabled ? '28px' : '2px', transition: 'left 0.2s',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. HELP & SUPPORT HUB SCREEN */}
      {showSupportHub && (
        <div className="support-hub-screen fade-in">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button 
              onClick={() => setShowSupportHub(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
            >
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-h2" style={{ margin: 0, color: 'var(--primary-green-dark)' }}>{localT[lang].support}</h2>
          </div>

          {/* Ticket submission Success Alert */}
          {ticketSuccessMsg && (
            <div className="glass scale-in" style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--primary-green)', borderRadius: '16px', color: 'var(--primary-green-dark)', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Check size={20} strokeWidth={2.5} />
              <span>{ticketSuccessMsg}</span>
            </div>
          )}

          {/* Ticket Form */}
          <form className="glass" onSubmit={handleSubmitTicket} style={{ padding: '20px', marginBottom: '24px' }}>
            <h3 className="text-h3" style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--primary-green-dark)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <HelpCircle size={18} />
              {localT[lang].file_ticket}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{localT[lang].ticket_category}</label>
                <select 
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', color: '#1f2937' }}
                  required
                >
                  <option value="">-- {localT[lang].select_category} --</option>
                  <option value="cat_weather">{localT[lang].cat_weather}</option>
                  <option value="cat_mandi">{localT[lang].cat_mandi}</option>
                  <option value="cat_seeds">{localT[lang].cat_seeds}</option>
                  <option value="cat_disease">{localT[lang].cat_disease}</option>
                  <option value="cat_other">{localT[lang].cat_other}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{t('help_support')}</label>
                <textarea 
                  value={supportDesc}
                  onChange={(e) => setSupportDesc(e.target.value)}
                  placeholder={localT[lang].issue_desc}
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'white', resize: 'none', fontSize: '14px', color: '#1f2937' }}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submittingTicket}
                style={{ 
                  background: 'var(--primary-green)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '16px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  fontSize: '15px',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.2)'
                }}
              >
                {submittingTicket ? localT[lang].submitting : localT[lang].submit_ticket}
              </button>
            </div>
          </form>

          {/* FAQs list accordion */}
          <div className="glass" style={{ padding: '20px' }}>
            <h3 className="text-h3" style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--primary-green-dark)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Info size={18} />
              {localT[lang].faq_title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs[lang].map((faq, index) => {
                const isOpen = openFaqIdx === index;
                return (
                  <div 
                    key={index}
                    onClick={() => setOpenFaqIdx(isOpen ? null : index)}
                    style={{ 
                      background: 'rgba(255,255,255,0.5)', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', paddingRight: '8px', color: 'var(--text-dark)' }}>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} color="var(--primary-green)" /> : <ChevronDown size={18} color="var(--text-light)" />}
                    </div>
                    {isOpen && (
                      <div style={{ padding: '12px 16px 16px', fontSize: '13px', color: 'var(--text-light)', borderTop: '1px solid var(--glass-border)', lineHeight: 1.5, background: 'rgba(255,255,255,0.3)' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. CONTACT KISSAN CALL CENTER DIALOG/POPUP */}
      {showKissanCallCenter && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }} className="fade-in">
          <div className="glass scale-in" style={{ padding: '24px', width: '100%', maxWidth: '380px', position: 'relative', background: 'var(--card-bg)' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '28px', background: 'rgba(16, 185, 129, 0.1)', 
              color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <Phone size={26} />
            </div>

            <h3 className="text-h2" style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--primary-green-dark)' }}>{localT[lang].call_center}</h3>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px', lineHeight: 1.4 }}>{localT[lang].call_center_desc}</p>

            <div style={{ background: 'var(--bg-color)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase' }}>{localT[lang].toll_free}</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-green-dark)' }}>1800-180-1551</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase' }}>{localT[lang].timings}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)' }}>{localT[lang].timings_val}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowKissanCallCenter(false)}
                style={{ 
                  flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--glass-border)', 
                  background: 'transparent', color: 'var(--text-dark)', fontWeight: 'bold', cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {localT[lang].close}
              </button>
              <a 
                href="tel:18001801551"
                style={{ 
                  flex: 1, padding: '14px', borderRadius: '14px', border: 'none', 
                  background: 'var(--primary-green)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                  fontSize: '14px', textAlign: 'center', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                }}
              >
                <Phone size={16} />
                {localT[lang].call_now}
              </a>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
