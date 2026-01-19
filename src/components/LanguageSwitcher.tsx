import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { type Language } from '../i18n/translations';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: 'SD' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰' }
];

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium text-text-main dark:text-gray-300"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-40 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-[100] ltr:right-0 rtl:left-0 transform origin-top">
                    <div className="flex flex-col p-1">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-start hover:bg-gray-50 dark:hover:bg-white/5 transition-colors
                                    ${language === lang.code ? 'bg-primary/5 text-primary font-bold' : 'text-text-main dark:text-gray-200'}
                                `}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
