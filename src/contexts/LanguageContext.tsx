
import React, { createContext, useContext, useState } from 'react';

type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  es: {
    'app.title': 'Loterías Dominicanas',
    'nav.results': 'Resultados',
    'nav.categories': 'Categorías',
    'nav.hot-numbers': 'Números Calientes',
    'nav.generator': 'Generador',
    'nav.settings': 'Configuración',
    'common.today': 'Hoy',
    'categories.title': 'Categorías de Loterías',
    'hot-numbers.title': 'Números Calientes',
    'generator.title': 'Generador de Números',
    'settings.title': 'Configuración',
  },
  en: {
    'app.title': 'Dominican Lotteries',
    'nav.results': 'Results',
    'nav.categories': 'Categories',
    'nav.hot-numbers': 'Hot Numbers',
    'nav.generator': 'Generator',
    'nav.settings': 'Settings',
    'common.today': 'Today',
    'categories.title': 'Lottery Categories',
    'hot-numbers.title': 'Hot Numbers',
    'generator.title': 'Number Generator',
    'settings.title': 'Settings',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    return stored || 'es';
  });

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
