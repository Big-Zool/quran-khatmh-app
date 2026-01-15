/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": {
                    DEFAULT: "#6b8e7c",
                    dark: "#557263"
                },
                "background": {
                    light: "#fafaf9",
                    dark: "#2a3733"
                },
                "surface": {
                    light: "#ffffff",
                    dark: "#364540"
                },
                "text": {
                    main: "#141514",
                    sub: "#727975",
                    muted: "#727975",
                    light: "#727975"
                },
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "arabic": ["Noto Sans Arabic", "sans-serif"],
                "quran": ["Amiri", "serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px"
            },
            backgroundImage: {
                'islamic-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236b8e7c' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                'pattern-light': "radial-gradient(#6b8e7c 0.5px, transparent 0.5px), radial-gradient(#6b8e7c 0.5px, #fafaf9 0.5px)",
                'pattern-dark': "radial-gradient(#6b8e7c 0.5px, transparent 0.5px), radial-gradient(#6b8e7c 0.5px, #2a3733 0.5px)",
            },
            backgroundSize: {
                'pattern': '20px 20px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
