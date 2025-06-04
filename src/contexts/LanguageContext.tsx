
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    'app.title': 'Loterías Dominicanas Today',
    'nav.results': 'Resultados',
    'nav.categories': 'Sorteos',
    'nav.hot-numbers': 'Números Calientes',
    'nav.generator': 'Generador',
    'nav.settings': 'Configuraciones',
    'results.title': 'Resultados de Hoy',
    'results.search': 'Buscar fecha anterior',
    'results.all-categories': 'Todas las loterías',
    'results.delayed-numbers': 'Los números más atrasados en todas las loterías',
    'categories.title': 'Categorías de Sorteos',
    'hot-numbers.title': 'Números Calientes',
    'generator.title': 'Generador de Combinaciones',
    'generator.dreams': 'Interpretación de Sueños',
    'generator.zodiac': 'Números del Zodíaco',
    'generator.coffee': 'Lectura de Café',
    'generator.birthday': 'Números de Cumpleaños',
    'generator.animals': 'Animales en Sueños',
    'generator.feelings': 'Sentimientos y Emociones',
    'generator.history': 'Historial de Números',
    'settings.title': 'Configuraciones',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.contact': 'Contacto',
    'settings.share': 'Compartir App',
    'settings.download': 'Descargar App',
    'settings.about': 'Acerca de',
    'settings.privacy': 'Políticas de Privacidad',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'language.spanish': 'Español',
    'language.english': 'English',
    'common.today': 'Hoy',
    'common.search': 'Buscar',
    'common.generate': 'Generar',
    'common.share': 'Compartir',
    'common.delete': 'Eliminar',
    'common.close': 'Cerrar',
    'common.copyright': '© 2025 Loterías Dominicanas Today. Todos los derechos reservados.',
    'developed.by': 'Desarrollado por',
    'developed.with.love': 'Hecho con ❤️'
  },
  en: {
    'app.title': 'Dominican Lotteries Today',
    'nav.results': 'Results',
    'nav.categories': 'Draws',
    'nav.hot-numbers': 'Hot Numbers',
    'nav.generator': 'Generator',
    'nav.settings': 'Settings',
    'results.title': "Today's Results",
    'results.search': 'Search previous date',
    'results.all-categories': 'All lotteries',
    'results.delayed-numbers': 'The most delayed numbers in all lotteries',
    'categories.title': 'Draw Categories',
    'hot-numbers.title': 'Hot Numbers',
    'generator.title': 'Number Generator',
    'generator.dreams': 'Dream Interpretation',
    'generator.zodiac': 'Zodiac Numbers',
    'generator.coffee': 'Coffee Reading',
    'generator.birthday': 'Birthday Numbers',
    'generator.animals': 'Animals in Dreams',
    'generator.feelings': 'Feelings and Emotions',
    'generator.history': 'Number History',
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.contact': 'Contact',
    'settings.share': 'Share App',
    'settings.download': 'Download App',
    'settings.about': 'About',
    'settings.privacy': 'Privacy Policy',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'language.spanish': 'Español',
    'language.english': 'English',
    'common.today': 'Today',
    'common.search': 'Search',
    'common.generate': 'Generate',
    'common.share': 'Share',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.copyright': '© 2025 Dominican Lotteries Today. All rights reserved.',
    'developed.by': 'Developed by',
    'developed.with.love': 'Made with ❤️'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>('lottery-language', 'es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
