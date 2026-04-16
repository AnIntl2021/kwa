import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('kwa_lang') || 'ar');

  useEffect(() => {
    localStorage.setItem('kwa_lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');

  // Helper: get the correct field from a bilingual object
  // e.g. t(item, 'title') returns item.titleAr or item.titleEn
  const t = (obj, field) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const key = `${field}${lang === 'ar' ? 'Ar' : 'En'}`;
    return obj[key] || obj[`${field}Ar`] || obj[`${field}En`] || '';
  };

  // Simple string translation
  const str = (ar, en) => lang === 'ar' ? ar : en;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, str }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
