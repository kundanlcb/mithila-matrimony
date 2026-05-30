import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRANSLATIONS } from '../mock/translations';

export type Locale = 'ma' | 'en' | 'hi';

interface LanguageContextProps {
  locale: Locale;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  setLanguage: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('ma');

  // Load language preference from local storage
  useEffect(() => {
    const savedLocale = localStorage.getItem('matrimony_locale') as Locale;
    if (savedLocale === 'ma' || savedLocale === 'en' || savedLocale === 'hi') {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLanguage = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('matrimony_locale', newLocale);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const item = TRANSLATIONS[key];
    if (!item) {
      return key;
    }
    
    let text = item[locale];
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`{${placeholder}}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
