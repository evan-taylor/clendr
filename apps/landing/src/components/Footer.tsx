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
    <footer className={`relative overflow-hidden text-zinc-100 py-16 ${className}`}>
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7dd3f6] to-transparent"></div>
      
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
              <img
                src="/clendr-white.png"
                alt="Clendr"
                className="h-8 w-auto mr-2"
              />
            </div>
            <p className="text-zinc-400 mt-2 ml-1">The future of calendar apps</p>
            
            {/* Company Address */}
            <address className="text-zinc-500 mt-4 ml-1 not-italic text-sm">
              2261 Market Street #86329<br />
              San Francisco, CA 94114
            </address>
          </motion.div>
          
          <motion.div className="flex gap-6" variants={itemVariants}>
            {footerLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="text-zinc-400 hover:text-zinc-100 transition-colors duration-300 hover:underline underline-offset-4 cursor-pointer relative z-20 px-2 py-1"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="border-t border-zinc-800/30 mt-8 pt-8 text-center md:text-left text-zinc-500 text-sm"
          variants={itemVariants}
        >
          <p>&copy; {new Date().getFullYear()} Clendr. All rights reserved. <span className="text-[#7dd3f6]">Made with ♥ in CA</span></p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;