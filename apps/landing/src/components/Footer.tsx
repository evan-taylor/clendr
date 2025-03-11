import { motion } from 'framer-motion';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className = '' }: FooterProps) => {
  const footerLinks = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className={`relative overflow-hidden bg-gray-950 text-white py-16 ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900 to-gray-950 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/10 via-transparent to-teal-900/10 opacity-30 -z-10" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 -z-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>
      
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="mb-8 md:mb-0" variants={itemVariants}>
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 bg-gradient-to-r from-primary-500 to-teal-500 rounded-xl flex items-center justify-center shadow-glow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-geist bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Clendr</h2>
            </div>
            <p className="text-gray-400 mt-2 ml-1">The future of calendar apps</p>
            
            {/* Company Address */}
            <address className="text-gray-500 mt-4 ml-1 not-italic text-sm">
              2261 Market Street #86329<br />
              San Francisco, CA 94114
            </address>
          </motion.div>
          
          <motion.div className="flex gap-6" variants={itemVariants}>
            {footerLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline underline-offset-4 cursor-pointer relative z-20 px-2 py-1"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-800/30 mt-8 pt-8 text-center md:text-left text-gray-500 text-sm"
          variants={itemVariants}
        >
          <p>&copy; {new Date().getFullYear()} Clendr. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 