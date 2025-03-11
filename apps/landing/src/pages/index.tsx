import Head from 'next/head';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  // Add smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  
  // Add parallax mouse effect to the entire page
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.parallax').forEach((layer) => {
        const element = layer as HTMLElement;
        const speed = element.getAttribute('data-speed') || '0.05';
        const x = (window.innerWidth - e.pageX * parseFloat(speed)) / 100;
        const y = (window.innerHeight - e.pageY * parseFloat(speed)) / 100;
        
        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Manage loading state
  useEffect(() => {
    // Add a loading screen that fades out
    const body = document.body;
    body.classList.add('loading');
    
    setTimeout(() => {
      body.classList.remove('loading');
      body.classList.add('loaded');
    }, 500);
  }, []);
  
  return (
    <>
      <Head>
        <title>Clendr | The AI-powered calendar app</title>
        <meta name="description" content="The lightning-fast AI-powered calendar app that transforms how you schedule your time." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content="Clendr | The AI-powered calendar app" />
        <meta property="og:description" content="The lightning-fast AI-powered calendar app that transforms how you schedule your time." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clendr.app" />
        <meta property="og:image" content="https://clendr.app/og-image.png" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Clendr | The AI-powered calendar app" />
        <meta name="twitter:description" content="The lightning-fast AI-powered calendar app that transforms how you schedule your time." />
        <meta name="twitter:image" content="https://clendr.app/twitter-image.png" />
      </Head>
      
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden"
        >
          {/* Page loading overlay */}
          <motion.div
            className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ pointerEvents: 'none' }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 0], 
                opacity: [1, 1, 0] 
              }}
              transition={{ 
                duration: 1,
                times: [0, 0.7, 1]
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
          
          <Header />
          
          <main>
            {/* Hero Section */}
            <Hero 
              title={<>Scheduling, <span className="gradient-text">reimagined</span></>}
              subtitle="The lightning-fast AI-powered calendar app that transforms how you schedule your time."
              className="pt-28"
            />
            
            {/* Features Section */}
            <Features />
            
            {/* How It Works Section */}
            <HowItWorks />
            
            {/* CTA Section */}
            <CTA />
          </main>
          
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  );
} 