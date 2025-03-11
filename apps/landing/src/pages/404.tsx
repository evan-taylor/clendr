import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | Clendr</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center py-20">
          <motion.div 
            className="max-w-3xl w-full mx-auto text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="mb-8">
              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link href="/" className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-primary-600 to-teal-600 rounded-lg shadow-lg hover:from-primary-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                  Back to Home
                </Link>
              </motion.div>
            </div>
            
            <div className="mt-12 text-gray-600 dark:text-gray-400">
              <p>If you're seeing 404 errors for JavaScript assets, try:</p>
              <ul className="list-disc list-inside mt-4 text-left max-w-lg mx-auto">
                <li className="mb-2">Clearing your browser cache</li>
                <li className="mb-2">Running the fix-static-assets.sh script in the terminal</li>
                <li className="mb-2">Opening the browser console and running <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">fetch('/clear-cache.js').then(r => r.text()).then(eval)</code></li>
              </ul>
            </div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
} 