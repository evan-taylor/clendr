import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className = '' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-gray-900/80 backdrop-blur-sm shadow-sm' 
          : 'bg-transparent'
      } ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 mr-2 bg-gradient-to-r from-primary-500 to-teal-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Clendr</span>
          </Link>

          {/* Join Waitlist Button */}
          <motion.a 
            href="/waitlist" 
            className="inline-flex px-4 py-2 bg-gradient-to-r from-primary-600 to-teal-600 text-white font-medium rounded-lg transition-colors shadow-md"
            whileHover={{ 
              y: -2,
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)'
            }}
            transition={{ 
              type: 'spring',
              stiffness: 500,
              damping: 15
            }}
          >
            Join Waitlist
          </motion.a>
        </div>
      </div>
    </header>
  );
};

export default Header; 