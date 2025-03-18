import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Components
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import CursorEffect from '../components/CursorEffect';
import ClientOnly from '../components/ClientOnly';

export default function Home() {
  // Track if the page has loaded and if we're on client-side
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Manage loading state - client-side only
  useEffect(() => {
    // Hide the default cursor
    document.documentElement.classList.add('hide-cursor');
    
    // Add a loading screen that fades out
    const body = document.body;
    body.classList.add('loading');
    
    setTimeout(() => {
      body.classList.remove('loading');
      body.classList.add('loaded');
      setIsLoaded(true);
    }, 600);
    
    return () => {
      document.documentElement.classList.remove('hide-cursor');
    };
  }, []);
  
  return (
    <>
      <Head>
        <title>Clendr | AI-powered calendar app for effortless scheduling</title>
        <meta name="description" content="Transform how you schedule your time with Clendr. Our AI-powered calendar app optimizes your schedule with smart time blocks and intelligent suggestions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content="Clendr | AI-powered calendar app for effortless scheduling" />
        <meta property="og:description" content="Transform how you schedule your time with Clendr. Our AI-powered calendar app optimizes your schedule with smart time blocks and intelligent suggestions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clendr.app" />
        <meta property="og:image" content="https://clendr.app/og-image.png" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Clendr | AI-powered calendar app for effortless scheduling" />
        <meta name="twitter:description" content="Transform how you schedule your time with Clendr. Our AI-powered calendar app optimizes your schedule with smart time blocks and intelligent suggestions." />
        <meta name="twitter:image" content="https://clendr.app/twitter-image.png" />
      </Head>
      
      {/* Custom cursor effect - only client side */}
      <ClientOnly>
        <CursorEffect />
        
        {/* Style for hiding cursor - client-side only */}
        <style jsx global>{`
          html.hide-cursor, 
          html.hide-cursor * {
            cursor: none !important;
          }
        `}</style>
      </ClientOnly>
      
      {/* Main content */}
      <div className="min-h-screen text-zinc-100 overflow-hidden relative">
        {/* Static background elements that will be the same on server and client */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-zinc-950 bg-gradient-to-b from-zinc-900 to-zinc-950"></div>
          <div className="absolute inset-0 bg-grid opacity-20"></div>
          <div className="noise-overlay"></div>
        </div>
        
        {/* Dynamic animated background - client-side only */}
        <ClientOnly>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="opacity-100"
          />
          <AnimatedBackground />
        </ClientOnly>
        
        {/* Page loading overlay - client side only */}
        <ClientOnly>
          {!isLoaded && (
            <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-md flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
        </ClientOnly>
        
        <Header />
        
        <main className="relative z-10">
          {/* Hero Section */}
          <Hero 
            title={<>Master your time with <span className="text-gradient">perfect balance</span></>}
            subtitle="The sophisticated AI calendar that intelligently orchestrates your schedule for optimized productivity and improved focus."
            className="pt-40 pb-24"
          />
          
          {/* Features Section */}
          <Features />
          
          {/* How It Works Section */}
          <HowItWorks />
          
          {/* CTA Section */}
          <CTA />
        </main>
        
        <Footer />
      </div>
    </>
  );
}