import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Terms: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white flex flex-col items-center p-4">
            {/* Header */}
            <header className="w-full max-w-md flex items-center mb-8 pt-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="flex-1 text-center pr-8">
                    <h1 className="font-bold text-lg">{t('termsTitle')}</h1>
                </div>
            </header>

            <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-3xl">gavel</span>
                </div>

                <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
                    {t('termsComingSoon')}
                </p>
            </div>
        </div>
    );
};

export default Terms;
