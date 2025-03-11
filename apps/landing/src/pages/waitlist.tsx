import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WaitlistForm from '../components/WaitlistForm';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Waitlist() {
  return (
    <>
      <Head>
        <title>Join the Waitlist | Clendr</title>
        <meta name="description" content="Join the waitlist for Clendr - the lightning-fast AI-powered calendar app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden"
      >
        <Header />
        
        <main>
          <section className="relative overflow-hidden pt-32 pb-20">
            {/* Animated background - using the dots variant with low intensity */}
            <AnimatedBackground variant="dots" intensity="low" />
            
            <div className="container mx-auto px-4 py-12 relative z-10">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Join the <span className="gradient-text">Waitlist</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Be the first to experience Clendr when we launch. Join our waitlist today!
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100/20 dark:border-gray-700/20"
                >
                  <WaitlistForm />
                </motion.div>
                
                <motion.div
                  className="mt-16 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-lg font-medium mb-4">What to expect:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Early access to Clendr</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Launch updates and news</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Special founding member perks</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Opportunity to provide feedback</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </motion.div>
    </>
  );
} 