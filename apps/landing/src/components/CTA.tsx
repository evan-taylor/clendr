import { motion } from 'framer-motion';
import WaitlistForm from './WaitlistForm';

interface CTAProps {
  className?: string;
}

const CTA = ({ className = '' }: CTAProps) => {
  return (
    <section 
      id="waitlist" 
      className={`relative py-24 md:py-32 overflow-hidden ${className}`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 -z-10"></div>
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
      
      <motion.div 
        className="absolute -left-32 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"
        animate={{ 
          y: [0, 50, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -right-32 top-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
        animate={{ 
          y: [0, -50, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div 
        className="absolute left-1/3 bottom-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="glass-card p-12 rounded-3xl relative overflow-hidden border border-gray-200/20 dark:border-gray-700/20 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }}
          >
            {/* Background gradient animation */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-teal-500/5 to-blue-500/5 dark:from-primary-500/10 dark:via-teal-500/10 dark:to-blue-500/10"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundSize: '200% 200%' }}
              />
            </div>
            
            {/* Geometric accent shape */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-teal-500/10 rounded-full blur-xl"></div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 border border-primary-500/20 rounded-full"></div>
            
            <div className="text-center mb-12 relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-teal-600 dark:from-primary-500 dark:to-teal-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to Transform Your Calendar?
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join our waitlist today and be the first to experience Clendr when we launch.
              </motion.p>
              
              <motion.div 
                className="max-w-md mx-auto relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.a 
                  href="/waitlist"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-primary-600 to-teal-600 rounded-lg shadow-lg hover:from-primary-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)'
                  }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 500,
                    damping: 15
                  }}
                >
                  Join the Waitlist
                </motion.a>
              </motion.div>
              
              <motion.div 
                className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p>No spam, ever. We respect your privacy.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 