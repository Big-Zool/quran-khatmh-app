import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Terms: React.FC = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const isRtl = language === 'ar' || language === 'ur' || language === 'fa';

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white flex flex-col items-center p-4">
            {/* Header */}
            <header className="w-full max-w-2xl flex items-center mb-6 pt-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">{isRtl ? 'arrow_forward' : 'arrow_back'}</span>
                </button>
                <div className="flex-1 text-center pr-10">
                    <h1 className="font-bold text-xl">{t('termsTitle')}</h1>
                </div>
            </header>

            <div className="w-full max-w-2xl flex flex-col gap-6 mb-12">
                {/* Dedication Card */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 border border-primary/10 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                    </div>
                    <p className="text-lg font-arabic leading-relaxed text-primary-dark dark:text-primary-light">
                        {t('sadaqahJariyah')}
                    </p>
                </div>

                {/* Main Terms Content */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="space-y-6">
                        <ul className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                            {(t('termsText') as unknown as string[]).map((line, index) => (
                                <li key={index} className="flex gap-3">
                                    <span className="text-primary mt-1.5 flex-shrink-0">
                                        <span className="material-symbols-outlined text-[10px]">circle</span>
                                    </span>
                                    <span className={`leading-relaxed ${isRtl ? 'font-arabic text-lg' : 'font-display text-base'} text-gray-700 dark:text-gray-300`}>
                                        {line}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                        <div className="flex flex-col gap-6">
                            {/* Contact Section */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">contact_support</span>
                                    {t('contactUs')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir="ltr">
                                    <button
                                        onClick={() => window.open('mailto:bashmohandes04@gmail.com', '_blank')}
                                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl hover:bg-gray-100 dark:hover:bg-black/30 transition-colors"
                                    >
                                        <span className="text-xl">📧</span>
                                        <span className="text-sm font-mono truncate">bashmohandes04@gmail.com</span>
                                    </button>
                                    <button
                                        onClick={() => window.open('https://wa.me/905338538057', '_blank')}
                                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl hover:bg-gray-100 dark:hover:bg-black/30 transition-colors"
                                    >
                                        <span className="text-xl">📱</span>
                                        <span className="text-sm font-mono">+90 533 853 80 57</span>
                                    </button>
                                    <button
                                        onClick={() => window.open('https://instagram.com/kpzlz', '_blank')}
                                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl hover:bg-gray-100 dark:hover:bg-black/30 transition-colors"
                                    >
                                        <span className="text-xl">📷</span>
                                        <span className="text-sm font-mono">kpzlz</span>
                                    </button>
                                </div>
                            </div>

                            {/* Source Section */}
                            <div className="flex items-center gap-2 text-sm text-text-sub dark:text-gray-400 bg-gray-50 dark:bg-black/10 p-4 rounded-xl">
                                <span className="material-symbols-outlined text-lg">info</span>
                                <span>{t('quranSource')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;

