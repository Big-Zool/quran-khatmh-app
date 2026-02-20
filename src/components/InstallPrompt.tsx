import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA Install Prompt Component
 * 
 * Shows a native-styled prompt to install the app
 * Only appears when the app can be installed
 * Respects user's dismissal choice
 */
const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed the prompt
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed === 'true') return;

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the default mini-infobar
            e.preventDefault();

            // Store the event for later use
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show custom prompt after a delay (better UX)
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`[PWA] User choice: ${outcome}`);

        // Hide the prompt regardless of outcome
        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Remember dismissal for this session
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-fade-in">
            <div className="bg-white dark:bg-surface-dark border-2 border-primary rounded-2xl shadow-2xl shadow-primary/20 p-5 flex items-start gap-4">
                {/* Icon */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-primary">download</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="font-bold text-text-main dark:text-white mb-1">
                        ثبّت التطبيق
                    </h3>
                    <p className="text-sm text-text-sub dark:text-gray-400 mb-3">
                        استخدم التطبيق بدون متصفح للوصول السريع
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleInstallClick}
                            className="flex-1 bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors"
                        >
                            تثبيت
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2 rounded-xl font-medium text-sm text-text-sub hover:bg-background-light dark:hover:bg-black/20 transition-colors"
                        >
                            ليس الآن
                        </button>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg text-text-sub">close</span>
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;
