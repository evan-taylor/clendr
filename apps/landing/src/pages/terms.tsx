import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Terms() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1.0]
      }
    }
  };
  
  return (
    <>
      <Head>
        <title>Terms & Conditions | Clendr</title>
        <meta name="description" content="Terms and conditions for using the Clendr calendar application." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
        <AnimatedBackground />
        <Header />
        
        <main className="container mx-auto px-4 py-32 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div 
              className="glass-effect-card p-8 rounded-xl"
              variants={fadeIn}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-8 font-geist text-zinc-100"
                variants={fadeIn}
              >
                Terms & Conditions
              </motion.h1>

              <div className="bg-zinc-800/30 p-6 rounded-xl mb-8 border border-zinc-800">
                <p className="text-sm text-zinc-400">
                  Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="prose prose-zinc prose-invert max-w-none">
                <motion.h2 variants={fadeIn} className="text-zinc-100">1. Acceptance of Terms</motion.h2>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  By accessing or using the Clendr calendar application ("Service"), you agree to be bound by these Terms and Conditions ("Terms") and our Privacy Policy. If you disagree with any part of the terms, then you may not access the Service.
                </motion.p>

                <motion.h2 variants={fadeIn} className="text-zinc-100">2. Description of Service</motion.h2>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  Clendr provides a calendar and scheduling service that allows users to create, manage, and share calendar events and schedules. The specific features and functionality may change over time.
                </motion.p>

                <motion.h2 variants={fadeIn} className="text-zinc-100">3. User Accounts</motion.h2>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                </motion.p>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </motion.p>

                <motion.h2 variants={fadeIn} className="text-zinc-100">4. Intellectual Property</motion.h2>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Clendr Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Clendr Inc.
                </motion.p>

                <motion.h2 variants={fadeIn} className="text-zinc-100">5. Free Trial</motion.h2>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  Clendr Inc. may, at its sole discretion, offer a free trial subscription for a limited period of time. You may be required to enter your billing information to sign up for Free Trial.
                </motion.p>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  If you do enter your billing information when signing up for Free Trial, you will not be charged by Clendr Inc. until Free Trial has expired. On the last day of Free Trial period, unless you cancelled your Subscription, you will be automatically charged the applicable subscription fee for the type of Subscription you have selected.
                </motion.p>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  At any time and without notice, Clendr Inc. reserves the right to (i) modify Terms of Service of Free Trial offer, or (ii) cancel such Free Trial offer.
                </motion.p>

                <motion.h2 variants={fadeIn} className="text-zinc-100">6. Contact Us</motion.h2>
                <motion.p variants={fadeIn} className="text-zinc-300">
                  If you have any questions about these Terms, please contact us at terms@clendr.com.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
} 