import { useState } from 'react';
import { motion } from 'framer-motion';

interface WaitlistFormProps {
  className?: string;
}

export const WaitlistForm = ({ className = '' }: WaitlistFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setIsSubmitted(true);
      setEmail('');
      setName('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join waitlist';
      setError(message);
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Variants for form animations
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  if (isSubmitted) {
    return (
      <motion.div 
        className={`${className} overflow-hidden`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1.0] }}
      >
        <div className="bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-800/30 rounded-xl p-8 text-center transition-all duration-300 shadow-lg">
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
          <motion.h3 
            className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            You're on the List!
          </motion.h3>
          <motion.p 
            className="text-lg text-green-700 dark:text-green-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            We'll notify you when Clendr is ready for you to try.
          </motion.p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={`${className} transition-all relative z-10 text-left`}
      aria-label="Waitlist signup form"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col space-y-5">
        <motion.div variants={itemVariants} className="text-left">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block text-left">
            Your Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              aria-label="Full name"
              aria-required="true"
              className="fancy-input pr-10 text-left"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-left">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block text-left">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              aria-label="Email address"
              aria-required="true"
              aria-invalid={!!error}
              className="fancy-input pr-10 text-left"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label={isSubmitting ? 'Joining waitlist...' : 'Join waitlist'}
            className="cta-button w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              'Join the Waitlist'
            )}
          </button>
        </motion.div>
        
        {error && (
          <motion.div 
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
        
        <motion.p 
          className="text-sm text-gray-500 dark:text-gray-400"
          variants={itemVariants}
        >
          We'll keep you updated on our launch. No spam, guaranteed.
        </motion.p>
      </div>
    </motion.form>
  );
};

export default WaitlistForm; 