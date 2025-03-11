import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  index?: number;
}

export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  className = '', 
  index = 0 
}: FeatureCardProps) => {
  return (
    <motion.div 
      className={`${className} floating-card glass-card p-8 rounded-2xl border border-gray-100/20 dark:border-gray-800/30
                  group`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.215, 0.61, 0.355, 1.0] 
      }}
    >
      <div className="relative z-10">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6
                    group-hover:scale-110 group-hover:shadow-glow transition-all duration-300"
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
        >
          <div className="text-white text-2xl">
            {icon}
          </div>
        </motion.div>
        
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute right-0 bottom-0 w-20 h-20 opacity-10 -z-10 dark:opacity-5 bg-pattern-dots transform rotate-12 group-hover:scale-125 transition-transform duration-500" />
      
      {/* Background gradient hover effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
};

export default FeatureCard; 