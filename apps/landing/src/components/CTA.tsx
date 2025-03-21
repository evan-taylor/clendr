import { motion } from 'framer-motion';

interface CTAProps {
  className?: string;
}

const CTA = ({ className = '' }: CTAProps) => {
  return (
    <section 
      id="waitlist" 
      className={`relative py-24 md:py-32 overflow-hidden ${className}`}
    >
      {/* Subtle background elements */}
      <div className="absolute left-0 right-0 h-px bg-zinc-800"></div>
      
      <motion.div 
        className="absolute -left-32 top-0 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl"
        animate={{ 
          y: [0, 30, 0],
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -right-32 top-1/4 w-80 h-80 bg-zinc-800/30 rounded-full blur-3xl"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div 
        className="absolute left-1/3 bottom-0 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="glass-effect-card relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1.0] }}
          >
            {/* Background subtle gradient */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-zinc-900 to-[#7dd3f6]/10"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundSize: '200% 200%' }}
              />
            </div>
            
            {/* Geometric accent shape - subtle */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#7dd3f6]/10 rounded-full blur-xl"></div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 border border-[#7dd3f6]/10 rounded-full"></div>
            
            <div className="text-center mb-12 relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6 text-zinc-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Elevate Your Productivity Experience
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join our exclusive waitlist to experience Clendr's sophisticated calendar solution.
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
                  className="cta-button px-8 py-4 text-base"
                  whileHover={{ 
                    y: -2,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 400,
                    damping: 15
                  }}
                >
                  Join the Waitlist
                </motion.a>
              </motion.div>
              
              <motion.div 
                className="mt-10 text-center text-zinc-500 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p>Your privacy is paramount. We'll never share your information.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;