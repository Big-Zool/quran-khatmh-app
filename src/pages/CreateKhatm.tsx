import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { createKhatm } from '../firebase/khatmService';

const CreateKhatm: React.FC = () => {
    const navigate = useNavigate();
    const [khatmName, setKhatmName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            return stored === 'dark' || !stored;
        }
        return true;
    });

    // Dark Mode Init
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
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

    const handleCreate = async () => {
        if (!khatmName.trim()) {
            setError("الرجاء إدخال اسم الختمة قبل المتابعة");
            return;
        }

        setIsCreating(true);
        setError(null); // Clear previous errors
        try {
            console.log("Attempting to create khatm with name:", khatmName);
            const id = await createKhatm(khatmName);
            console.log("Khatm created with ID:", id);
            navigate(`/share/${id}`);
        } catch (err: any) {
            console.error("Failed to create khatm full error:", err);
            // Display firebase error message if available
            setError(`Error: ${err.message || "Unknown error occurred"}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-islamic-pattern opacity-100 dark:opacity-50"></div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Main Layout Container */}
            <div className="layout-container relative z-10 flex h-full grow flex-col justify-center items-center p-4 md:p-8">
                {/* Central Card Container */}
                <div className="w-full max-w-[480px] bg-surface-light dark:bg-surface-dark shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden transition-colors duration-300 border border-primary/5 dark:border-white/5">

                    {/* Header */}
                    <header className="flex items-center justify-between px-6 py-5 border-b border-primary/10 dark:border-white/5 bg-white/50 dark:bg-black/10 backdrop-blur-sm">
                        <button className="flex items-center justify-center text-text-main dark:text-white hover:bg-primary/10 rounded-full w-10 h-10 transition-colors opacity-0 pointer-events-none">
                            {/* Hidden back button for balance, opacity 0 */}
                            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                        </button>
                        <h2 className="text-lg font-bold tracking-tight text-text-main dark:text-white">ختمة جديدة</h2>
                        <button onClick={toggleTheme} className="flex items-center justify-center text-text-main dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-white/10 rounded-full w-10 h-10 transition-colors">
                            <span className="material-symbols-outlined text-2xl">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                    </header>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col gap-8">
                        {/* Page Heading & Intention */}
                        <div className="flex flex-col gap-2 text-right">
                            <span className="text-primary text-sm font-semibold tracking-wider uppercase opacity-80">النية</span>
                            <h1 className="text-3xl md:text-4xl font-black leading-tight text-text-main dark:text-white font-arabic">
                                ابدأ ختمة قرآنية
                            </h1>
                            <p className="text-text-sub dark:text-gray-400 text-base leading-relaxed mt-1">
                                أنشئ مساحة للعائلة والأصدقاء لختم القرآن الكريم معاً.
                            </p>
                        </div>

                        {/* Input Form */}
                        <div className="flex flex-col gap-6">
                            <label className="group flex flex-col gap-3">
                                <span className="text-text-main dark:text-gray-200 text-base font-medium">لمن هذه الختمة؟</span>
                                <div className="relative">
                                    <input
                                        className="w-full h-16 px-5 rounded-lg border-2 border-transparent bg-background-light dark:bg-black/20 text-text-main dark:text-white placeholder-text-sub/50 focus:border-primary focus:bg-white dark:focus:bg-black/30 focus:ring-0 transition-all duration-300 text-lg shadow-inner outline-none"
                                        placeholder="مثال: امير عوض  , امنه مشاوي ، عبدالرازق محمد عبدالمجيد..."
                                        type="text"
                                        value={khatmName}
                                        onChange={(e) => {
                                            setKhatmName(e.target.value);
                                            if (error) setError(null);
                                        }}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        {/* Left position for icon in RTL */}
                                        <span className="material-symbols-outlined">edit</span>
                                    </div>
                                </div>
                                <p className="text-sm text-text-sub dark:text-gray-400 flex items-start gap-2 mt-1">
                                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">info</span>
                                    تسمية الختمة تساعد المشاركين على استحضار النية والدعاء.
                                </p>
                            </label>

                            {/* Divider */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                            {/* Helper Info Box */}
                            <div className="bg-primary/5 dark:bg-white/5 rounded-lg p-5 border border-primary/10 dark:border-white/5 flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-sm flex items-center justify-center shrink-0 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-sm font-bold text-text-main dark:text-white">ماذا يحدث بعد ذلك؟</h4>
                                    <p className="text-sm text-text-sub dark:text-gray-300 leading-relaxed">
                                        بعد الإنشاء، ستحصل على رابط فريد لدعوة العائلة والأصدقاء لاختيار عدد الصفحات وقراءتها.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200" dir="ltr">
                                {error}
                            </div>
                        )}
                        {/* Action Button */}
                        <div className="pt-2">
                            <button
                                onClick={handleCreate}
                                disabled={isCreating}
                                className={`relative w-full overflow-hidden rounded-xl bg-primary text-white h-14 font-bold text-lg shadow-[0_8px_16px_-4px_rgba(107,142,124,0.4)] hover:shadow-[0_12px_20px_-4px_rgba(107,142,124,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group ${isCreating ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isCreating ? 'جاري الإنشاء...' : 'إنشاء الختمة'}
                                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1">arrow_back</span>
                                    {/* Arrow needs to point left in RTL for 'forward' motion? physical left is 'back' arrow. 'arrow_back' points left. 'arrow_forward' points right.
                       In RTL, 'next' is usually left. So standard arrow_back (left) is correct for 'forward' direction visually?
                       Actually, usually layout is mirrored. Next -> Left.
                       So 'arrow_back' icon (pointing left) is correct.
                   */}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                            <p className="text-center text-xs text-text-sub/60 dark:text-gray-500 mt-4">
                                بإنشائك للختمة، أنت توافق على شروط الخدمة.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                        <span className="material-symbols-outlined text-lg">mosque</span>
                        <span>منصة ختم للقرآن الكريم</span>
                    </div>
                    <Link to="/terms" className="text-xs text-text-sub hover:text-primary transition-colors underline">
                        الشروط والأحكام
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CreateKhatm;
