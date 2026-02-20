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

    // 1) LOCAL session counter - maintained in state for UI and Ref for unmount logic
    const [sessionClicks, setSessionClicks] = useState(0);
    const sessionClicksRef = useRef(0);
    const khatmRef = useRef<Khatm | null>(null);
    const hasSavedRef = useRef(false);

    // Fetch initial data ONCE
    useEffect(() => {
        if (!khatmId) return;

        getKhatmBySlug(khatmId)
            .then((data) => {
                setKhatm(data);
                khatmRef.current = data;
                setLoading(false);
            })
            .catch((err) => {
                console.error("Tasbih load error", err);
                setLoading(false);
            });
    }, [khatmId]);

    // 3) On Page Leave (unmount logic)
    useEffect(() => {
        return () => {
            const finalClicks = sessionClicksRef.current;
            const currentKhatm = khatmRef.current;

            // 5) Edge case: If clicks > 0 and not already saved
            if (finalClicks > 0 && currentKhatm?.id && !hasSavedRef.current) {
                // 3) Prevent double writes
                hasSavedRef.current = true;

                // 4) Use Firestore atomic increment
                incrementKhatmTasbih(currentKhatm.id, finalClicks)
                    .then(() => {
                        console.log(`[Tasbeh] Successfully pushed ${finalClicks} clicks.`);
                    })
                    .catch((err) => {
                        // 5) If write fails -> log error but do not crash UI
                        console.error("[Tasbeh] Failed to push clicks:", err);
                    });
            }
        };
    }, []); // Empty dependency array ensures this runs strictly on unmount

    // 2) Increment Behavior
    const handleClick = () => {
        // Vibrate for feedback
        if (navigator.vibrate) navigator.vibrate(50);

        // 2) Optimistic update: increase state (UI) and Ref (for final capture)
        setSessionClicks(prev => {
            const next = prev + 1;
            sessionClicksRef.current = next;
            return next;
        });
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

    // 1) Logic: Display current counter (Firestore start value + local session clicks)
    const serverClicks = khatm.tasbihState?.totalClicks || 0;
    const totalClicks = serverClicks + sessionClicks;
    const currentDhikrIndex = Math.floor(totalClicks / TARGET_COUNT) % DHIKR_LIST.length;
    const displayCount = totalClicks === 0 ? 0 : ((totalClicks - 1) % TARGET_COUNT) + 1;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center relative overflow-x-hidden text-text-main dark:text-white">

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
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md z-10 gap-8 mt-4 px-4">

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

                {/* Global Stats - Shared globally per khatma link */}
                <div className="text-center animate-fade-in">
                    <p className="text-text-sub dark:text-gray-400 text-sm mb-1">مجموع التسبيح</p>
                    <p className="text-3xl font-bold font-mono">{totalClicks.toLocaleString()}</p>
                </div>

            </div>
        </div>
    );
};

export default TasbihPage;
