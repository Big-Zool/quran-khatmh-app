import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getKhatmBySlug, assignPages, type Khatm } from '../firebase/khatmService';
import { useLanguage } from '../contexts/LanguageContext';
import FloatingTasbihButton from '../components/FloatingTasbihButton';

const JoinKhatm: React.FC = () => {
    const { khatmId } = useParams<{ khatmId: string }>(); // slug
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Get name from query params if available
    const queryParams = new URLSearchParams(window.location.search);
    const sharedName = queryParams.get('name');

    const [khatm, setKhatm] = useState<Khatm | null>(null);
    const [loading, setLoading] = useState(true);
    const [pagesToRead, setPagesToRead] = useState(2);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            getKhatmBySlug(khatmId)
                .then(data => {
                    if (data) setKhatm(data);
                    else setError(t('khatmNotFound'));
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [khatmId]);

    const handleStartReading = async () => {
        if (!khatm || !pagesToRead) return;
        setAssigning(true);
        setError(null);

        try {
            // Pass the full title with cycle number to the reading interface
            const fullTitle = `${khatm.name} (${t('khatmCycle')} ${khatm.completedCount + 1})`;

            const assignment = await assignPages(khatm.id!, pagesToRead);
            navigate(`/read/${khatmId}`, { state: { ...assignment, khatmName: fullTitle } });
        } catch (err: any) {
            console.error(err);
            if (err.message.includes("completed")) {
                setError(t('errorCompleted'));
                // Optionally refresh state or redirect
            } else {
                setError(t('errorReserve'));
            }
        } finally {
            setAssigning(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-primary font-bold">{t('loading')}</div>;
    if (!khatm) return <div className="p-8 text-center">{error || t('khatmNotFound')}</div>;
    // We no longer block joining even if isCompleted is true, 
    // because it will reset on the next assignment.
    // if (khatm.isCompleted) return <div className="p-8 text-center text-xl font-bold text-primary">{t('khatmCompletedMsg')}</div>;

    // Determine current progress percentage
    const progressPercent = Math.round(((khatm.currentPage - 1) / 604) * 100);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white flex flex-col items-center p-4">

            {/* Header */}
            <header className="w-full max-w-md flex items-center justify-between py-4 mb-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <h1 className="font-bold text-lg">{t('joinTitle')}</h1>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                    <span className="material-symbols-outlined">
                        {isDark ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
            </header>

            <div className="w-full max-w-[440px] flex flex-col gap-6">

                {sharedName && (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
                        <p className="text-sm text-primary font-bold">صدقة جارية عن {sharedName}</p>
                    </div>
                )}

                {/* Khatm Info Card */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit mb-3">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-bold uppercase">{t('activeKhatm')}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">
                            {khatm.name} ({t('khatmCycle')} {khatm.completedCount + 1})
                        </h2>
                        <div className="flex justify-between items-end mt-6">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{t('progress')}</span>
                                <span className="text-xs text-text-sub">{t('page')} {khatm.currentPage} {t('from')}</span>
                            </div>
                            <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-[100px]">mosque</span>
                    </div>
                </div>

                {/* Remaining Pages Card */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-semibold text-[#6B8E7C]">
                                الصفحات المتبقية
                            </span>
                            <span className="text-[10px] text-[#6B8E7C]/70">
                                من إجمالي المصحف
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-bold text-[#6B8E7C]">
                                {Math.max(0, 604 - khatm.currentPage + 1)}
                            </span>
                            <span className="text-xs font-semibold text-[#6B8E7C]">
                                صفحة
                            </span>
                        </div>
                    </div>
                </div>

                {/* Selection Section */}
                <div className="flex flex-col gap-4 text-center mt-2">
                    <h3 className="text-xl font-bold">{t('howManyPages')}</h3>
                    <p className="text-sm text-text-sub">{t('selectPagesDesc')}</p>

                    <div className="flex flex-wrap justify-center gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                                key={num}
                                onClick={() => setPagesToRead(num)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-200 border-2
                                    ${pagesToRead === num
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 -translate-y-1'
                                        : 'bg-white dark:bg-transparent border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Badge */}
                <div className="flex items-center justify-center gap-2 bg-primary/5 text-primary py-3 rounded-xl border border-primary/10 mx-4">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span className="text-sm font-semibold">
                        {t('estimatedTime')}: {pagesToRead * 2} {t('minutes')}
                    </span>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-center text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={handleStartReading}
                    disabled={assigning}
                    className="w-full bg-primary hover:bg-primary-dark disabled:opacity-70 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                    {assigning ? t('reserving') : t('startReading')}
                    {!assigning && <span className="material-symbols-outlined rotate-180">arrow_back</span>}
                </button>

            </div>

            {/* Floating Tasbih Button */}
            <FloatingTasbihButton khatmId={khatmId || ''} />
        </div>
    );
};

export default JoinKhatm;
