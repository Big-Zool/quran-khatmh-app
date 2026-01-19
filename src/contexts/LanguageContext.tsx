import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Language } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['ar']) => string;
    dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Determine initial language: localStorage > browser > 'ar'
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('language') as Language;
            if (stored && ['ar', 'en', 'tr', 'ur'].includes(stored)) return stored;

            // Try browser language? Optional. Defaulting to 'ar' as app seems Arabic-first.
        }
        return 'ar';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const dir = language === 'ar' || language === 'ur' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [dir, language]);

    const t = (key: keyof typeof translations['ar']) => {
        return translations[language][key] || translations['ar'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
