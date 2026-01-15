import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getKhatmBySlug, type Khatm } from '../firebase/khatmService';

const ShareKhatm: React.FC = () => {
    const { khatmId } = useParams<{ khatmId: string }>(); // This is actually the SLUG now
    const [khatm, setKhatm] = useState<Khatm | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (khatmId) {
            // Treat the param as a slug
            getKhatmBySlug(khatmId)
                .then(data => {
                    if (data) {
                        setKhatm(data);
                    } else {
                        // Fallback? Or just set null
                        setKhatm(null);
                    }
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [khatmId]);

    const handleCopy = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error("Failed to copy", err);
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
                <div className="text-primary animate-pulse font-bold">جاري التحميل...</div>
            </div>
        );
    }

    if (!khatm) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark flex-col gap-4">
                <h1 className="text-xl font-bold text-text-main dark:text-white">الختمة غير موجودة</h1>
                <Link to="/" className="text-primary underline">العودة للرئيسية</Link>
            </div>
        );
    }

    // We use the SLUG (khatm.slug) for the join link if available, fallback to existing ID path if really needed (but slug is preferred)
    // The current URL param (khatmId) IS the slug if we came from create.
    const shareSlug = khatm.slug || khatm.id;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark p-4 gap-6">
            <div className="w-full max-w-[480px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-primary/10 p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    تم إنشاء الختمة بنجاح
                </h1>

                <h2 className="text-xl font-medium text-primary mb-6">
                    {khatm.name}
                </h2>

                <div className="mb-8">
                    <label className="block text-sm text-text-sub dark:text-gray-400 mb-2">رابط المشاركة</label>
                    <div className="flex items-stretch rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-background-light dark:bg-black/20">
                        <input
                            readOnly
                            value={window.location.href}
                            className="flex-1 px-4 py-3 bg-transparent text-left text-sm text-text-main dark:text-white outline-none"
                            dir="ltr"
                        />
                        <button
                            onClick={handleCopy}
                            className="px-4 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 text-primary font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {copied ? "تم النسخ" : "نسخ"}
                        </button>
                    </div>
                </div>

                <div className="bg-background-light dark:bg-black/20 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-text-main dark:text-white">نسبة الإنجاز</span>
                        <span className="text-sm font-bold text-primary">
                            {Math.round(((khatm.currentPage - 1) / 604) * 100)}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.round(((khatm.currentPage - 1) / 604) * 100)}%` }}></div>
                    </div>
                </div>

                <Link
                    to={`/join/${shareSlug}`}
                    className="flex w-full items-center justify-center gap-2 bg-primary text-white rounded-xl py-3.5 font-bold hover:bg-primary-dark transition-colors"
                >
                    <span className="material-symbols-outlined">menu_book</span>
                    عرض الختمة
                </Link>
            </div>
        </div>
    );
};

export default ShareKhatm;
