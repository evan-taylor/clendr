import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WaitlistForm from '../components/WaitlistForm';
import AnimatedBackground from '../components/AnimatedBackground';
import ClientOnly from '../components/ClientOnly';
import CursorEffect from '../components/CursorEffect';

export default function Waitlist() {
  return (
    <>
      <Head>
        <title>Join the Waitlist | Clendr</title>
        <meta name="description" content="Join the waitlist for Clendr - the lightning-fast AI-powered calendar app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen text-zinc-100 bg-zinc-950 overflow-hidden"
      >
        <Header />
        
        <main>
          <section className="relative overflow-hidden pt-32 pb-20">
            {/* Static background elements */}
            <div className="fixed inset-0 z-0 overflow-hidden">
              <div className="absolute inset-0 bg-zinc-950 bg-gradient-to-b from-zinc-900 to-zinc-950"></div>
              <div className="absolute inset-0 bg-grid opacity-20"></div>
              <div className="noise-overlay"></div>
            </div>
            
            {/* Dynamic animated background - client-side only */}
            <ClientOnly>
              <AnimatedBackground />
            </ClientOnly>
            
            <div className="container mx-auto px-4 py-12 relative z-10">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-zinc-100 mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Join the <span className="text-gradient">Waitlist</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-zinc-400 mb-12 leading-relaxed"
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
                  className="glass-effect-card"
                >
                  <WaitlistForm />
                </motion.div>
                
                <motion.div
                  className="mt-16 text-zinc-400 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="text-lg font-medium mb-4">What to expect:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-zinc-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Early access to Clendr</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-zinc-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Launch updates and news</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-zinc-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Special founding member perks</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-zinc-400 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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