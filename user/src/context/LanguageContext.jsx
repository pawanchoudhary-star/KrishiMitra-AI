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
    // Scanner translations
    'disease_scanner': 'Disease Scanner',
    'scanner_desc': 'Take a photo of your crop to detect diseases instantly',
    'tap_to_scan': 'Tap to Scan',
    'or_upload_gallery': 'or upload from gallery',
    'gallery': 'Gallery',
    'camera': 'Camera',
    'recent_scans': 'Recent Scans',
    'scanning_ai': 'Scanning AI...',
    'view_fix': 'View Remedy / Fix',
    'no_scans': 'No scans recorded yet. Scan your first crop now!',
    'remedy_title': 'AI Diagnosis & Remedy',
    'analyzing_crop': 'AI is analyzing your crop...',
    'scan_failed_alert': 'Scanning failed. Please try again.',
    'back': 'Back',
    'close': 'Close',
    // Crop Care translations
    'crop_care_header': '120-Day Crop Care Planner',
    'no_active_crops': 'No active crops registered yet.',
    'add_crops_profile': 'Add crops in your Profile page to generate a personalized 120-day farming task schedule!',
    'go_to_profile': 'Go to Profile',
    'days_since_sowing': 'days since sowing',
    'completed_status': 'Done',
    'mark_done': 'Mark as Done',
    'irrigation': 'Irrigation',
    'weeding': 'Weeding',
    'pesticide': 'Pesticide',
    'fertilizer': 'Fertilizer',
    'harvesting': 'Harvesting',
    'day': 'Day',
    'days_age': 'days old',
    'no_tasks': 'No tasks generated for this crop.',
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
    // Scanner translations
    'disease_scanner': 'रोग स्कैनर',
    'scanner_desc': 'रोगों का तुरंत पता लगाने के लिए अपनी फसल की फोटो लें',
    'tap_to_scan': 'स्कैन करने के लिए टैप करें',
    'or_upload_gallery': 'या गैलरी से अपलोड करें',
    'gallery': 'गैलरी',
    'camera': 'कैमरा',
    'recent_scans': 'हाल के स्कैन',
    'scanning_ai': 'AI स्कैन कर रहा है...',
    'view_fix': 'उपचार देखें',
    'no_scans': 'अभी तक कोई स्कैन रिकॉर्ड नहीं हुआ है। अपनी पहली फसल स्कैन करें!',
    'remedy_title': 'AI रोग निदान और उपचार',
    'analyzing_crop': 'AI आपकी फसल का विश्लेषण कर रहा है...',
    'scan_failed_alert': 'स्कैन विफल रहा। कृपया पुनः प्रयास करें।',
    'back': 'पीछे',
    'close': 'बंद करें',
    // Crop Care translations
    'crop_care_header': '120-दिवसीय फसल देखभाल योजनाकार',
    'no_active_crops': 'अभी तक कोई सक्रिय फसल पंजीकृत नहीं है।',
    'add_crops_profile': '120-दिन का व्यक्तिगत खेती कार्य कार्यक्रम बनाने के लिए अपने प्रोफाइल पेज पर फसलें जोड़ें!',
    'go_to_profile': 'प्रोफ़ाइल पर जाएं',
    'days_since_sowing': 'बुवाई के दिन',
    'completed_status': 'पूर्ण',
    'mark_done': 'पूर्ण के रूप में चिह्नित करें',
    'irrigation': 'सिंचाई',
    'weeding': 'निराई-गुड़ाई',
    'pesticide': 'कीटनाशक',
    'fertilizer': 'उर्वरक',
    'harvesting': 'कटाई',
    'day': 'दिन',
    'days_age': 'दिन पुरानी',
    'no_tasks': 'इस फसल के लिए कोई कार्य नहीं मिला।',
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
