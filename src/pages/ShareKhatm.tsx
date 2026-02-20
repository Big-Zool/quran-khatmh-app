import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subscribeToKhatmBySlug, type Khatm } from '../firebase/khatmService';
import { useLanguage } from '../contexts/LanguageContext';
import FloatingTasbihButton from '../components/FloatingTasbihButton';

const ShareKhatm: React.FC = () => {
    const { khatmId } = useParams<{ khatmId: string }>(); // This is actually the SLUG now
    const { t } = useLanguage();
    const [khatm, setKhatm] = useState<Khatm | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Theme logic can be moved to context or kept if minimal
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            return stored === 'dark' || !stored;
        }
        return true;
    });

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            const isDarkPref = stored === 'dark' || !stored;
            setIsDark(isDarkPref);
            if (isDarkPref) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        if (khatmId) {
            // Updated to real-time subscription
            const unsubscribe = subscribeToKhatmBySlug(
                khatmId,
                (data) => {
                    setKhatm(data);
                    setLoading(false);
                },
                (err) => {
                    console.error("Subscription error", err);
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        }
    }, [khatmId]);

    // We use the SLUG (khatm.slug) for the join link if available, fallback to existing ID path if really needed (but slug is preferred)
    // The current URL param (khatmId) IS the slug if we came from create.
    const shareSlug = khatm?.slug || khatm?.id;
    const shareBaseUrl = `${window.location.protocol}//${window.location.host}`;
    const shareLink = khatm ? `${shareBaseUrl}/s/${shareSlug}?name=${encodeURIComponent(khatm.name)}` : '';
    const shareNameSafe = khatm ? encodeURIComponent(khatm.name) : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error("Failed to copy", err);
        });
    };

    const handleShare = async () => {
        if (navigator.share && khatm) {
            try {
                await navigator.share({
                    title: `صدقة جارية - ${khatm.name}`,
                    text: `انضم إلينا في ختم القرآن الكريم - ${khatm.name}`,
                    url: shareLink,
                });
            } catch (err) {
                console.error("Error sharing", err);
            }
        } else {
            handleCopy();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
                <div className="text-primary animate-pulse font-bold">{t('loading')}</div>
            </div>
        );
    }

    if (!khatm) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark flex-col gap-4">
                <h1 className="text-xl font-bold text-text-main dark:text-white">{t('khatmNotFound')}</h1>
                <Link to="/" className="text-primary underline">{t('backHome')}</Link>
            </div>
        );
    }

    // Derived values
    const progressPercent = Math.round(((khatm.currentPage - 1) / 604) * 100);
    const remainingPages = Math.max(0, 604 - khatm.currentPage + 1);

    return (
        <div className="min-h-screen flex flex-col items-center bg-background-light dark:bg-background-dark p-4 pt-16 relative pb-24 overflow-x-hidden">

            {/* Header with Mode Switcher */}
            <div className="absolute top-4 right-4 z-50">
                <button onClick={toggleTheme} className="p-2 text-text-sub hover:bg-gray-100 dark:hover:bg-white/10 rounded-full dark:text-gray-300 transition-colors">
                    <span className="material-symbols-outlined">
                        {isDark ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
            </div>

            <div className="w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-primary/10 p-8 text-center animate-fade-in relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    {t('createdSuccess')}
                </h1>

                <h2 className="text-xl font-medium text-primary mb-6">
                    {khatm.name} ({t('khatmCycle')} {khatm.completedCount + 1})
                </h2>

                <h3 className="text-sm font-bold text-text-sub mb-2">{t('shareLink')}</h3>
                <div className="mb-6 flex items-stretch rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-background-light dark:bg-black/20">
                    <button
                        onClick={handleCopy}
                        className="px-6 bg-[#6B8E7C] text-white font-bold text-sm hover:bg-[#6B8E7C]/90 transition-colors shadow-sm"
                    >
                        {copied ? t('copied') : t('copy')}
                    </button>
                    <input
                        readOnly
                        value={shareLink}
                        className="flex-1 px-4 py-3 bg-transparent text-left text-sm text-text-main dark:text-white outline-none overflow-ellipsis"
                        dir="ltr"
                    />
                </div>

                {/* Progress Bar */}
                <div className="bg-background-light dark:bg-black/20 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-text-main dark:text-white">{t('progress')}</span>
                        <span className="text-sm font-bold text-primary">
                            {progressPercent}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                {/* Feature 1: Remaining Pages */}
                <div className="bg-background-light dark:bg-black/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <div>
                        <span className="text-2xl font-bold text-text-main dark:text-white">{remainingPages}</span>
                        <span className="text-xs font-bold text-text-sub dark:text-gray-400 mr-2">{t('page')}</span>
                    </div>
                    <span className="text-sm font-bold text-text-sub dark:text-gray-400">{t('remainingPages') || 'الصفحات المتبقية'}</span>
                </div>

                <div className="flex flex-col gap-3">
                    {/* View Khatm (Green) */}
                    <Link
                        to={`/join/${shareSlug}${khatm.name ? `?name=${shareNameSafe}` : ''}`}
                        className="flex w-full items-center justify-center gap-2 bg-primary text-white rounded-xl py-3.5 font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">menu_book</span>
                        {t('viewKhatm')}
                    </Link>

                    {/* Share Link (White/Secondary) */}
                    <button
                        onClick={handleShare}
                        className="flex w-full items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main dark:text-white rounded-xl py-3.5 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined">share</span>
                        {t('shareLink')}
                    </button>
                </div>
            </div>

            {/* Feature 2: Floating Tasbih Button */}
            <FloatingTasbihButton khatmId={khatmId || ''} />
        </div>
    );
};

export default ShareKhatm;
