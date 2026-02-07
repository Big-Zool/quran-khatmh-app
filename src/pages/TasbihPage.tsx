import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getKhatmBySlug, incrementKhatmTasbih, type Khatm } from '../firebase/khatmService';

const DHIKR_LIST = [
    "سبحان الله",
    "الحمد لله",
    "لا إله إلا الله",
    "الله أكبر",
    "لا حول ولا قوة إلا بالله"
];

const TARGET_COUNT = 33;

const TasbihPage: React.FC = () => {
    const { khatmId } = useParams<{ khatmId: string }>(); // slug
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [khatm, setKhatm] = useState<Khatm | null>(null);
    const [loading, setLoading] = useState(true);

    // LOCAL session counter - never synced in real-time
    const [sessionClicks, setSessionClicks] = useState(0);

    // Track if we've already saved (to prevent double-save on unmount)
    const hasSavedRef = useRef(false);

    // Load initial data ONCE (no real-time listener)
    useEffect(() => {
        if (!khatmId) return;

        getKhatmBySlug(khatmId)
            .then((data) => {
                setKhatm(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Tasbih load error", err);
                setLoading(false);
            });
    }, [khatmId]);

    // Save session clicks on unmount
    useEffect(() => {
        return () => {
            if (sessionClicks > 0 && khatm?.id && !hasSavedRef.current) {
                hasSavedRef.current = true;
                // Fire-and-forget atomic increment
                incrementKhatmTasbih(khatm.id, sessionClicks).catch(console.error);
            }
        };
    }, [sessionClicks, khatm?.id]);

    const handleClick = () => {
        // Vibrate for feedback
        if (navigator.vibrate) navigator.vibrate(50);

        // Increment LOCAL counter only
        setSessionClicks(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!khatm) {
        return (
            <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
                <div className="text-text-main dark:text-white">{t('khatmNotFound')}</div>
            </div>
        );
    }

    // Calculate current dhikr based on TOTAL (server + session)
    const totalClicks = (khatm.tasbihState?.totalClicks || 0) + sessionClicks;
    const currentDhikrIndex = Math.floor(totalClicks / TARGET_COUNT) % DHIKR_LIST.length;
    const displayCount = totalClicks === 0 ? 0 : ((totalClicks - 1) % TARGET_COUNT) + 1;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center relative overflow-hidden text-text-main dark:text-white">

            {/* Header */}
            <header className="absolute top-0 w-full p-4 flex justify-between items-center z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-surface-light/50 dark:bg-black/20 hover:bg-black/10 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <h1 className="text-xl font-bold">{t('tasbihTitle')}</h1>
                <div className="w-10"></div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md z-10 gap-10 mt-10 px-4">

                {/* Dhikr Text */}
                <div className="text-center animate-fade-in">
                    <h2 className="text-3xl font-bold font-arabic mb-2 px-4 leading-relaxed">
                        {DHIKR_LIST[currentDhikrIndex]}
                    </h2>
                </div>

                {/* Big Circle Button */}
                <button
                    onClick={handleClick}
                    className="w-64 h-64 rounded-full bg-[#6B8E78] text-white flex flex-col items-center justify-center shadow-2xl shadow-[#6B8E78]/40 hover:scale-105 active:scale-95 transition-all duration-200 tap-highlight-transparent select-none"
                >
                    <span className="text-6xl font-bold font-mono tracking-tighter">
                        {displayCount}
                    </span>
                    <span className="text-sm opacity-80 mt-2 font-medium">
                        اضغط هنا
                    </span>
                </button>

                {/* Stats */}
                <div className="text-center">
                    <p className="text-text-sub dark:text-gray-400 text-sm mb-1">مجموع التسبيح</p>
                    <p className="text-3xl font-bold font-mono">{totalClicks.toLocaleString()}</p>
                </div>

            </div>
        </div>
    );
};

export default TasbihPage;
