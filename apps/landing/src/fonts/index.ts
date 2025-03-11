import { Inter } from 'next/font/google';

// Google Font for Inter
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
  preload: true,
});

// Fallback for Geist (using Inter)
export const geist = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
  adjustFontFallback: false,
  weight: ['400', '500', '600', '700'],
  preload: true,
}); 