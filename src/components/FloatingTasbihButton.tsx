import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FloatingTasbihButtonProps {
    khatmId: string; // This could be the SLUG or ID, but typically we route using slug or id depending on context.
    // Given existing patterns, we likely route with what we have.
}

const FloatingTasbihButton: React.FC<FloatingTasbihButtonProps> = ({ khatmId }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/zeker/${khatmId}`)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#8BA888] rounded-full shadow-lg shadow-[#8BA888]/30 hover:bg-[#8BA888]/90 hover:scale-105 active:scale-95 transition-all duration-300 group"
            aria-label="المسبحة الرقمية"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-12 transition-transform duration-500 w-8 h-8">
                {/* Dotted Beads forming a circle/abstract shape */}
                <circle cx="12" cy="4" r="1.5" fill="white" />
                <circle cx="16" cy="5" r="1.5" fill="white" />
                <circle cx="19" cy="8" r="1.5" fill="white" />
                <circle cx="20" cy="12" r="1.5" fill="white" />
                <circle cx="19" cy="16" r="1.5" fill="white" />
                <circle cx="16" cy="19" r="1.5" fill="white" />
                <circle cx="12" cy="20" r="1.5" fill="white" />
                <circle cx="8" cy="19" r="1.5" fill="white" />
                <circle cx="5" cy="16" r="1.5" fill="white" />
                <circle cx="4" cy="12" r="1.5" fill="white" />
                <circle cx="5" cy="8" r="1.5" fill="white" />
                <circle cx="8" cy="5" r="1.5" fill="white" />
            </svg>
        </button>
    );
};

export default FloatingTasbihButton;
