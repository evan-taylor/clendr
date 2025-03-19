import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Google Font for Inter
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
  preload: true,
});

// Local Geist font
export const geist = localFont({
  src: [
    {
      path: '../../public/fonts/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Geist-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
  display: 'swap',
  preload: true,
});