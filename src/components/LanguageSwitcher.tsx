import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { type Language } from '../i18n/translations';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰' },
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' }
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
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={toggleOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-bold text-text-main dark:text-gray-200"
            >
                <span className="text-xl">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
            </button>

            {isOpen && (
                <>
                    {/* Dark Backdrop - Very high z-index to cover page content definitely */}
                    <div
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[4px]"
                        onClick={() => setIsOpen(false)}
                        style={{ width: '100vw', height: '100vh', top: 0, left: 0 }}
                    />

                    {/* Dropdown Menu - Fully Opaque bg-white and dark:bg-surface-dark */}
                    <div className="absolute top-full mt-3 left-0 w-52 bg-white dark:bg-[#1a1c1e] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 overflow-hidden z-[110] transform origin-top-left animate-fade-in">
                        <div className="flex flex-col p-2 space-y-1">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm text-start transition-all duration-200
                                        ${language === lang.code
                                            ? 'bg-primary/10 text-primary font-black shadow-inner'
                                            : 'text-text-main dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold'}
                                    `}
                                >
                                    <span className="text-2xl filter drop-shadow-sm">{lang.flag}</span>
                                    <span className="flex-grow">{lang.label}</span>
                                    {language === lang.code && (
                                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
