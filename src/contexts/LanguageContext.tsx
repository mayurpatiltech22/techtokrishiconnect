import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  'nav.market': { en: 'Market Prices', hi: 'बाज़ार भाव', mr: 'बाजार भाव' },
  'nav.weather': { en: 'Weather', hi: 'मौसम', mr: 'हवामान' },
  'nav.equipment': { en: 'Equipment', hi: 'उपकरण', mr: 'साधने' },
  'nav.labor': { en: 'Labor', hi: 'श्रमिक', mr: 'मजूर' },
  'nav.schemes': { en: 'Schemes', hi: 'योजनाएं', mr: 'योजना' },
  'nav.products': { en: 'Products', hi: 'उत्पाद', mr: 'उत्पादने' },
  'nav.login': { en: 'Login', hi: 'लॉगिन', mr: 'लॉगिन' },
  'nav.logout': { en: 'Logout', hi: 'लॉगआउट', mr: 'लॉगआउट' },
  'nav.myBookings': { en: 'My Bookings', hi: 'मेरी बुकिंग', mr: 'माझी बुकिंग' },
  'nav.orders': { en: 'Orders', hi: 'ऑर्डर', mr: 'ऑर्डर' },
  'nav.cart': { en: 'Cart', hi: 'कार्ट', mr: 'कार्ट' },

  // Hero Section
  'hero.title': { en: 'Empowering Indian Farmers', hi: 'भारतीय किसानों को सशक्त बनाना', mr: 'भारतीय शेतकऱ्यांना सक्षम करणे' },
  'hero.subtitle': { en: 'Your one-stop platform for agricultural services, market prices, and farming solutions', hi: 'कृषि सेवाओं, बाज़ार भाव और खेती समाधान के लिए आपका एक-स्टॉप प्लेटफॉर्म', mr: 'कृषी सेवा, बाजारभाव आणि शेती उपायांसाठी तुमचे एकच व्यासपीठ' },
  'hero.marketPrices': { en: 'Market Prices', hi: 'बाज़ार भाव', mr: 'बाजार भाव' },
  'hero.browseEquipment': { en: 'Browse Equipment', hi: 'उपकरण देखें', mr: 'साधने पहा' },

  // Weather
  'weather.title': { en: '24/7 Weather Forecast', hi: '24/7 मौसम पूर्वानुमान', mr: '24/7 हवामान अंदाज' },
  'weather.subtitle': { en: 'Live weather conditions and 7-day forecasts for major cities across India', hi: 'भारत के प्रमुख शहरों के लिए लाइव मौसम और 7-दिवसीय पूर्वानुमान', mr: 'भारतातील प्रमुख शहरांसाठी थेट हवामान आणि 7-दिवसीय अंदाज' },
  'weather.searchPlaceholder': { en: 'Search city or state...', hi: 'शहर या राज्य खोजें...', mr: 'शहर किंवा राज्य शोधा...' },
  'weather.selectCity': { en: 'Select City', hi: 'शहर चुनें', mr: 'शहर निवडा' },
  'weather.humidity': { en: 'Humidity', hi: 'नमी', mr: 'आर्द्रता' },
  'weather.wind': { en: 'Wind', hi: 'हवा', mr: 'वारा' },
  'weather.visibility': { en: 'Visibility', hi: 'दृश्यता', mr: 'दृश्यमानता' },
  'weather.pressure': { en: 'Pressure', hi: 'दबाव', mr: 'दाब' },
  'weather.uvIndex': { en: 'UV Index', hi: 'यूवी सूचकांक', mr: 'यूव्ही निर्देशांक' },
  'weather.sunrise': { en: 'Sunrise', hi: 'सूर्योदय', mr: 'सूर्योदय' },
  'weather.sunset': { en: 'Sunset', hi: 'सूर्यास्त', mr: 'सूर्यास्त' },
  'weather.forecast': { en: '7-Day Forecast', hi: '7-दिन का पूर्वानुमान', mr: '7-दिवसीय अंदाज' },
  'weather.rainChance': { en: 'Rain', hi: 'बारिश', mr: 'पाऊस' },
  'weather.feelsLike': { en: 'Feels like', hi: 'महसूस होता है', mr: 'वाटते' },
  'weather.refresh': { en: 'Refresh', hi: 'ताज़ा करें', mr: 'रिफ्रेश करा' },
  'weather.loading': { en: 'Loading weather data...', hi: 'मौसम डेटा लोड हो रहा है...', mr: 'हवामान डेटा लोड होत आहे...' },
  'weather.error': { en: 'Failed to load weather data', hi: 'मौसम डेटा लोड करने में विफल', mr: 'हवामान डेटा लोड करण्यात अयशस्वी' },

  // Market Prices
  'market.title': { en: 'Live Mandi Prices', hi: 'लाइव मंडी भाव', mr: 'थेट मंडी भाव' },
  'market.subtitle': { en: 'Real-time agricultural commodity prices from mandis across India', hi: 'भारत भर की मंडियों से वास्तविक समय कृषि वस्तु मूल्य', mr: 'भारतभरातील मंड्यांमधून रिअल-टाइम कृषी कमोडिटी किमती' },
  'market.searchPlaceholder': { en: 'Search crops or markets...', hi: 'फसल या बाज़ार खोजें...', mr: 'पिके किंवा बाजार शोधा...' },
  'market.allCities': { en: 'All Cities', hi: 'सभी शहर', mr: 'सर्व शहरे' },
  'market.pricePerQuintal': { en: 'per quintal', hi: 'प्रति क्विंटल', mr: 'प्रति क्विंटल' },
  'market.viewHistory': { en: 'View Price History', hi: 'भाव इतिहास देखें', mr: 'भाव इतिहास पहा' },
  'market.priceHistory': { en: 'Price History', hi: 'भाव इतिहास', mr: 'भाव इतिहास' },

  // Schemes
  'schemes.title': { en: 'Government Schemes for Farmers', hi: 'किसानों के लिए सरकारी योजनाएं', mr: 'शेतकऱ्यांसाठी सरकारी योजना' },
  'schemes.subtitle': { en: 'Explore various central and state government schemes designed to support farmers', hi: 'किसानों की सहायता के लिए विभिन्न केंद्र और राज्य सरकार की योजनाओं का अन्वेषण करें', mr: 'शेतकऱ्यांना मदत करण्यासाठी विविध केंद्र आणि राज्य सरकारच्या योजनांचा शोध घ्या' },
  'schemes.applyNow': { en: 'Apply Now', hi: 'आवेदन करें', mr: 'अर्ज करा' },
  'schemes.learnMore': { en: 'Learn More', hi: 'और जानें', mr: 'अधिक जाणून घ्या' },
  'schemes.centralSchemes': { en: 'Central Schemes', hi: 'केंद्रीय योजनाएं', mr: 'केंद्रीय योजना' },
  'schemes.stateSchemes': { en: 'State Schemes', hi: 'राज्य योजनाएं', mr: 'राज्य योजना' },
  'schemes.laborSchemes': { en: 'Labor Schemes', hi: 'श्रमिक योजनाएं', mr: 'मजूर योजना' },

  // Crop Advisory
  'advisory.title': { en: 'Crop Advisory', hi: 'फसल सलाह', mr: 'पीक सल्ला' },
  'advisory.subtitle': { en: 'AI-powered crop recommendations based on weather and market trends', hi: 'मौसम और बाज़ार रुझानों के आधार पर AI-संचालित फसल सिफारिशें', mr: 'हवामान आणि बाजार ट्रेंडवर आधारित AI-चालित पीक शिफारसी' },
  'advisory.recommended': { en: 'Recommended Crops', hi: 'अनुशंसित फसलें', mr: 'शिफारस केलेली पिके' },
  'advisory.weatherSuitable': { en: 'Weather Suitable', hi: 'मौसम उपयुक्त', mr: 'हवामान योग्य' },
  'advisory.marketDemand': { en: 'Market Demand', hi: 'बाज़ार मांग', mr: 'बाजारातील मागणी' },
  'advisory.profitPotential': { en: 'Profit Potential', hi: 'लाभ क्षमता', mr: 'नफा क्षमता' },
  'advisory.high': { en: 'High', hi: 'उच्च', mr: 'उच्च' },
  'advisory.medium': { en: 'Medium', hi: 'मध्यम', mr: 'मध्यम' },
  'advisory.low': { en: 'Low', hi: 'कम', mr: 'कमी' },
  'advisory.bestTime': { en: 'Best Time to Sow', hi: 'बोने का सर्वोत्तम समय', mr: 'पेरणीची सर्वोत्तम वेळ' },
  'advisory.selectCity': { en: 'Select your city for personalized recommendations', hi: 'व्यक्तिगत सिफारिशों के लिए अपना शहर चुनें', mr: 'वैयक्तिक शिफारसींसाठी तुमचे शहर निवडा' },

  // Equipment
  'equipment.title': { en: 'Farm Equipment Rental', hi: 'कृषि उपकरण किराया', mr: 'शेती साधने भाडे' },
  'equipment.listEquipment': { en: 'List Your Equipment', hi: 'अपना उपकरण सूचीबद्ध करें', mr: 'तुमचे साधन सूचीबद्ध करा' },
  'equipment.perDay': { en: 'per day', hi: 'प्रति दिन', mr: 'प्रति दिन' },
  'equipment.bookNow': { en: 'Book Now', hi: 'अभी बुक करें', mr: 'आता बुक करा' },

  // Common
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...', mr: 'लोड होत आहे...' },
  'common.error': { en: 'An error occurred', hi: 'एक त्रुटि हुई', mr: 'एक त्रुटी आली' },
  'common.retry': { en: 'Retry', hi: 'पुनः प्रयास करें', mr: 'पुन्हा प्रयत्न करा' },
  'common.search': { en: 'Search', hi: 'खोजें', mr: 'शोधा' },
  'common.filter': { en: 'Filter', hi: 'फ़िल्टर', mr: 'फिल्टर' },
  'common.all': { en: 'All', hi: 'सभी', mr: 'सर्व' },
  'common.close': { en: 'Close', hi: 'बंद करें', mr: 'बंद करा' },
  'common.save': { en: 'Save', hi: 'सहेजें', mr: 'जतन करा' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें', mr: 'रद्द करा' },
  'common.submit': { en: 'Submit', hi: 'जमा करें', mr: 'सबमिट करा' },
  'common.language': { en: 'Language', hi: 'भाषा', mr: 'भाषा' },

  // Footer
  'footer.about': { en: 'About Us', hi: 'हमारे बारे में', mr: 'आमच्याबद्दल' },
  'footer.contact': { en: 'Contact', hi: 'संपर्क', mr: 'संपर्क' },
  'footer.privacy': { en: 'Privacy Policy', hi: 'गोपनीयता नीति', mr: 'गोपनीयता धोरण' },
  'footer.terms': { en: 'Terms of Service', hi: 'सेवा की शर्तें', mr: 'सेवा अटी' },
  'footer.copyright': { en: 'All rights reserved', hi: 'सर्वाधिकार सुरक्षित', mr: 'सर्व हक्क राखीव' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr' as Language, name: 'Marathi', nativeName: 'मराठी' },
  ];

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
