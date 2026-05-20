import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    'home': 'Home',
    'sell': 'Sell',
    'scan': 'Scan',
    'alerts': 'Alerts',
    'profile': 'Profile',
    'kya_ugau': 'Kya Ugau?',
    'crop_suggest': 'Crop suggestion AI',
    'crop_care': 'Crop Care',
    'smart_diagnosis': 'Smart diagnosis',
    'mandi_price': 'Mandi Price',
    'live_rates': 'Live rates',
    'ask_ai': 'Ask AI',
    'voice_assistant': 'Voice assistant',
    'govt_schemes': 'Govt. Schemes for You',
    'apply': 'Apply',
    'good_morning': 'Good Morning',
    'good_afternoon': 'Good Afternoon',
    'good_evening': 'Good Evening',
    'namaste': 'Namaste',
    // New translations for locations
    'manage_locations': 'Manage Locations',
    'my_crops': 'My Crops',
    'app_settings': 'App Settings',
    'help_support': 'Help & Support',
    'kissan_call_center': 'Contact Kissan Call Center',
    'log_out': 'Log Out',
    'saved_locations': 'Saved Locations',
    'add_new_location': 'Add New Location',
    'search_placeholder': 'Search Indian city, district or village...',
    'search': 'Search',
    'searching': 'Searching...',
    'no_matching_place': 'No matching place found. Please check spelling.',
    'search_failed': 'Location search failed. Please check network connection.',
    'duplicate_location': 'This location is already added!',
    'min_one_location': 'You must keep at least one location!',
    'acres': 'Acres',
    'crops': 'Crops',
    'loading_weather': 'Loading weather...',
  },
  hi: {
    'home': 'होम',
    'sell': 'मंडी/बेचें',
    'scan': 'स्कैन',
    'alerts': 'अलर्ट्स',
    'profile': 'प्रोफ़ाइल',
    'kya_ugau': 'क्या उगाऊँ?',
    'crop_suggest': 'फसल सुझाव AI',
    'crop_care': 'फसल की देखभाल',
    'smart_diagnosis': 'स्मार्ट निदान',
    'mandi_price': 'मंडी भाव',
    'live_rates': 'ताजा भाव',
    'ask_ai': 'AI से पूछें',
    'voice_assistant': 'वॉयस असिस्टेंट',
    'govt_schemes': 'आपके लिए सरकारी योजनाएं',
    'apply': 'आवेदन करें',
    'good_morning': 'सुप्रभात',
    'good_afternoon': 'शुभ दोपहर',
    'good_evening': 'शुभ संध्या',
    'namaste': 'नमस्ते',
    // New translations for locations
    'manage_locations': 'लोकेशन प्रबंधित करें',
    'my_crops': 'मेरी फसलें',
    'app_settings': 'ऐप सेटिंग्स',
    'help_support': 'सहायता और समर्थन',
    'kissan_call_center': 'किसान कॉल सेंटर से संपर्क करें',
    'log_out': 'लॉग आउट',
    'saved_locations': 'सहेजे गए स्थान',
    'add_new_location': 'नया स्थान जोड़ें',
    'search_placeholder': 'भारतीय शहर, जिला या गाँव खोजें...',
    'search': 'खोजें',
    'searching': 'खोज की जा रही है...',
    'no_matching_place': 'कोई मेल खाता स्थान नहीं मिला। कृपया वर्तनी जांचें।',
    'search_failed': 'लोकेशन खोज विफल रही। कृपया नेटवर्क कनेक्शन जांचें।',
    'duplicate_location': 'यह लोकेशन पहले ही जोड़ी जा चुकी है!',
    'min_one_location': 'आपको कम से कम एक लोकेशन रखनी होगी!',
    'acres': 'एकड़',
    'crops': 'फसलें',
    'loading_weather': 'मौसम लोड हो रहा है...',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'en');

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
