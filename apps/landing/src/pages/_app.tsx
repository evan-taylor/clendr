import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useEffect } from 'react';
import { inter, geist } from '../fonts';

export default function App({ Component, pageProps }: AppProps) {
  // Force dark mode for all users
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <main className={`${inter.variable} ${geist.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
} 