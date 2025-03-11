/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                blue: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                    950: '#3b0764',
                },
                teal: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
                geist: ['var(--font-geist)', 'Geist', 'sans-serif'],
            },
            animation: {
                tilt: 'tilt 10s infinite linear',
                fadeIn: 'fadeIn 0.5s ease-in-out',
                'infinite-scroll': 'infiniteScroll 25s linear infinite',
                float: 'float 6s ease-in-out infinite',
                pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient-x': 'gradient-x 15s ease infinite',
                'gradient-y': 'gradient-y 15s ease infinite',
                'gradient-xy': 'gradient-xy 15s ease infinite',
                'gradient-x-slow': 'gradient-x 30s ease infinite',
                'gradient-y-slow': 'gradient-y 30s ease infinite',
                'gradient-xy-slow': 'gradient-xy 30s ease infinite',
                shimmer: 'shimmer 2s linear infinite',
                'spin-slow': 'spin 8s linear infinite',
                wiggle: 'wiggle 1s ease-in-out infinite',
                'bounce-slow': 'bounce 5s infinite',
                'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-very-slow': 'pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                tilt: {
                    '0%, 50%, 100%': {
                        transform: 'rotate(0deg) scale(1)',
                    },
                    '25%': {
                        transform: 'rotate(0.5deg) scale(1.01)',
                    },
                    '75%': {
                        transform: 'rotate(-0.5deg) scale(0.99)',
                    },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                infiniteScroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                'gradient-y': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'center top'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'center center'
                    }
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                },
                'gradient-xy': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                },
                shimmer: {
                    '0%': {
                        backgroundPosition: '-700px 0'
                    },
                    '100%': {
                        backgroundPosition: '700px 0'
                    },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-cosmic': 'linear-gradient(to right, var(--tw-gradient-stops))',
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding',
                'width': 'width',
                'transform': 'transform',
            },
            transitionDuration: {
                '2000': '2000ms',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
                'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
                'glow-teal': '0 0 20px rgba(20, 184, 166, 0.4)',
            },
        },
    },
    plugins: [],
}; 