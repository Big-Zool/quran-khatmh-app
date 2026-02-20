import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollIndicator: React.FC = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    // Don't show on Reading Interface or Main Page
    const isReadingPage = pathname.startsWith('/read/');
    const isMainPage = pathname === '/';

    useEffect(() => {
        if (isReadingPage || isMainPage) {
            setIsVisible(false);
            return;
        }

        const checkScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Show if:
            // 1. Content is taller than window
            // 2. User hasn't scrolled to bottom yet (with threshold)
            const hasMoreContent = docHeight > windowHeight + 20;
            const isNotAtBottom = scrollTop + windowHeight < docHeight - 20;

            setIsVisible(hasMoreContent && isNotAtBottom);
        };

        // Check immediately
        checkScroll();

        // Check on events
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        // Check periodically for dynamic content (images loading, etc) and mutation
        const intervalId = setInterval(checkScroll, 1000);

        return () => {
            window.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
            clearInterval(intervalId);
        };
    }, [pathname, isReadingPage, isMainPage]);

    if (!isVisible || isReadingPage || isMainPage) return null;

    const handleScroll = () => {
        window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    };

    return (
        <button
            onClick={handleScroll}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] p-3 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md rounded-full shadow-lg border border-primary/1 text-primary hover:bg-primary hover:text-white transition-all duration-300 animate-bounce group"
            aria-label="Scroll Down"
        >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">keyboard_arrow_down</span>
        </button>
    );
};

export default ScrollIndicator;
