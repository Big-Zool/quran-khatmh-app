import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { getQuranPage, type QuranPageData, toArabicNumerals } from '../services/quranService';

interface ReadingState {
    startPage: number;
    endPage: number;
    khatmName?: string;
}

const ReadingInterface: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { khatmId } = useParams<{ khatmId: string }>(); // This is slug usually, but UI doesn't care
    const { startPage, endPage, khatmName } = (state as ReadingState) || {};

    const [isFinished, setIsFinished] = useState(false);
    const [pagesContent, setPagesContent] = useState<QuranPageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            return stored === 'dark' || !stored;
        }
        return true;
    });
    const [showReportModal, setShowReportModal] = useState(false);

    // Validate state
    const isValidSession = state && startPage && endPage;

    // Dark Mode Init
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        // Default to dark if no preference, or if stored is 'dark'
        const isDarkPref = storedTheme === 'dark' || !storedTheme;

        setIsDark(isDarkPref);
        if (isDarkPref) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    useEffect(() => {
        if (!isValidSession) return;

        const fetchPages = async () => {
            setLoading(true);
            try {
                const promises = [];
                for (let i = startPage; i <= endPage; i++) {
                    promises.push(getQuranPage(i));
                }
                const results = await Promise.all(promises);
                setPagesContent(results);
            } catch (err) {
                console.error(err);
                setError("حدث خطأ أثناء تحميل صفحات المصحف. يرجى التأكد من الاتصال بالإنترنت.");
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [startPage, endPage, isValidSession]);

    if (!isValidSession) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center text-center p-4">
                <p className="mb-4 font-bold text-lg dark:text-white">عذراً، لم يتم تحديد صفحات للقراءة.</p>
                <Link to={`/join/${khatmId}`} className="text-primary underline">الذهاب لصفحة الانضمام</Link>
            </div>
        );
    }

    const handleFinish = () => {
        setIsFinished(true);
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4 animate-fade-in relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-10 bg-islamic-pattern"></div>

                <div className="relative z-10 w-full max-w-md bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-primary/10 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl text-primary">volunteer_activism</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 font-arabic dark:text-white">تقبل الله طاعتكم</h2>

                    <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-xl mb-8 border border-gray-100 dark:border-gray-700">
                        <p className="text-lg leading-loose font-quran text-gray-800 dark:text-gray-200">
                            ”اللهم اجعل ثواب ما قرأت نورًا في قبره واغفر له وارحمه“
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate(`/join/${khatmId}`)}
                            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
                        >
                            قراءة المزيد
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-transparent text-text-sub py-3.5 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                            خروج
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display transition-colors duration-300 relative">

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-primary/20 relative">
                        <button
                            onClick={() => setShowReportModal(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="mb-6 mt-2 text-center">
                            <h3 className="text-xl font-bold text-primary mb-2">تنبيه</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                الرجاء الإبلاغ في حال ملاحظة وجود خطأ في الآية
                                <br />
                                أو في حال أن التطبيق لا يعمل بشكل صحيح
                            </p>
                        </div>

                        <div className="space-y-4 text-right" dir="ltr">
                            <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg flex items-center justify-end gap-3">
                                <span className="font-mono text-sm dark:text-gray-200">email: bashmohandes04@gmail.com</span>
                                <span className="text-lg">📧</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg flex items-center justify-end gap-3">
                                <span className="font-mono text-sm dark:text-gray-200">whatsapp: +90 533 853 80 57</span>
                                <span className="text-lg">📱</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg flex items-center justify-end gap-3">
                                <span className="font-mono text-sm dark:text-gray-200">instagram: kpzlz</span>
                                <span className="text-lg">📷</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowReportModal(false)}
                            className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark"
                        >
                            حسناً
                        </button>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5 h-16 flex items-center justify-between px-4">
                <button onClick={() => navigate(-1)} className="p-2 text-text-sub hover:bg-gray-100 dark:hover:bg-white/10 rounded-full dark:text-gray-300">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-sm font-bold dark:text-white">{khatmName}</h1>
                    <span className="text-xs text-primary font-bold">الصفحات {startPage} - {endPage}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        تنبيه
                    </button>
                    <button onClick={toggleTheme} className="p-2 text-text-sub hover:bg-gray-100 dark:hover:bg-white/10 rounded-full dark:text-gray-300">
                        <span className="material-symbols-outlined">
                            {isDark ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                </div>
            </header>

            {/* Reading Content */}
            <main className="flex-grow flex flex-col items-center p-4 pt-24 pb-32 w-full max-w-3xl mx-auto gap-8">

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-primary font-medium animate-pulse">جاري تحميل المصحف...</p>
                    </div>
                )}

                {error && (
                    <div className="w-full bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
                        <p className="font-bold mb-2">عذراً</p>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-50">
                            إعادة المحاولة
                        </button>
                    </div>
                )}

                {!loading && !error && pagesContent.map((page) => (
                    <article key={page.pageNumber} className="w-full bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {/* Page Header */}
                        <div className="bg-gray-50/50 dark:bg-white/5 py-3 border-b border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-1">
                            <h3 className="font-quran text-xl text-primary font-bold">
                                {page.surahNames.join(' • ')}
                            </h3>
                        </div>

                        {/* Verses Container */}
                        <div className="p-6 md:p-10 text-justify" dir="rtl">
                            <p className="font-quran text-3xl md:text-4xl leading-[2.5] text-text-main dark:text-gray-100">
                                {page.verses.map((verse) => {
                                    const verseNum = verse.verse_key.split(':')[1];
                                    return (
                                        <React.Fragment key={verse.id}>
                                            {verse.text_uthmani}
                                            <span className="text-primary text-2xl px-2 font-arabic_numerals inline-block select-none">
                                                ﴿{toArabicNumerals(verseNum)}﴾
                                            </span>
                                        </React.Fragment>
                                    );
                                })}
                            </p>
                        </div>

                        {/* Page Footer */}
                        <div className="bg-gray-50/30 dark:bg-white/5 py-2 px-6 border-t border-gray-100 dark:border-white/5 flex justify-center text-xs text-text-sub dark:text-gray-400">
                            <span>صفحة {toArabicNumerals(page.pageNumber)}</span>
                        </div>
                    </article>
                ))}

            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark z-50">
                <div className="max-w-md mx-auto">
                    {!loading && !error && (
                        <button
                            onClick={handleFinish}
                            className="w-full bg-primary hover:bg-primary-dark text-white h-14 rounded-xl shadow-lg shadow-primary/30 font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            أتممت القراءة
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default ReadingInterface;
