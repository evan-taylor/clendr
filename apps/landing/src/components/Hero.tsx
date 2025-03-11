import { ReactNode, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import WaitlistForm from './WaitlistForm';
import AnimatedBackground from './AnimatedBackground';
import FloatingShapes from './FloatingShapes';

interface HeroProps {
  title: ReactNode;
  subtitle: string;
  className?: string;
}

export const Hero = ({ title, subtitle, className = '' }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get current date information for the calendar
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Format date functions
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + date.getDate();
  };
  
  // Text reveal animations
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1.0] // cubic-bezier for a nice spring effect
      }
    })
  };

  // Feature highlight animations
  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8 + (i * 0.2),
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };
  
  // Calendar UI animation
  const calendarVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Animated background */}
      <AnimatedBackground variant="gradient" />
      
      {/* Floating 3D shapes - reduced count for less visual intensity */}
      <FloatingShapes count={6} intensity={0.03} />
      
      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        {/* Center title and subtitle in their own row */}
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight max-w-3xl"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={textVariants}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={textVariants}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Features and Form in separate columns */}
          <div className="lg:col-span-6 max-w-xl mx-auto lg:mx-0">
            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { icon: "⚡️", title: "Smart Scheduling", desc: "AI-optimized time blocks" },
                { icon: "🔄", title: "Sync Everywhere", desc: "Works across all devices" },
                { icon: "🤖", title: "AI Assistant", desc: "Intelligent suggestions" },
                { icon: "🔍", title: "Focus Time", desc: "Distraction-free zones" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="text-left p-4 rounded-xl glass-card border border-gray-200/10 dark:border-gray-700/20"
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={featureVariants}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Waitlist Button */}
            <motion.div 
              className="relative text-center lg:text-left"
              initial="hidden"
              animate="visible"
              custom={2}
              variants={textVariants}
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
          </div>
          
          {/* Calendar UI Illustration Column */}
          <motion.div 
            className="lg:col-span-6 relative hidden lg:block"
            initial="hidden"
            animate="visible"
            variants={calendarVariants}
          >
            {/* Calendar App UI */}
            <div className="relative mx-auto max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-teal-500/20 rounded-3xl blur-xl -z-10 transform rotate-3"></div>
              
              {/* Main calendar frame */}
              <div className="relative bg-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl p-5 backdrop-blur-sm">
                {/* Calendar header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                  <div>
                    <div className="text-white font-bold text-lg">{formatMonthYear(today)}</div>
                    <div className="text-gray-400 text-sm">Your optimized week</div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Calendar content */}
                <div className="space-y-3">
                  {/* Time block */}
                  <div className="bg-gray-800/80 p-3 rounded-lg border-l-4 border-primary-500">
                    <div className="flex justify-between">
                      <div className="text-white font-medium">Team Standup</div>
                      <div className="text-gray-400 text-sm">{formatDayDate(today)}, 9:00 - 9:30 AM</div>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">Daily team sync on project progress</div>
                  </div>
                  
                  {/* Time block - teal */}
                  <div className="bg-gray-800/80 p-3 rounded-lg border-l-4 border-teal-500">
                    <div className="flex justify-between">
                      <div className="text-white font-medium">Focus Block</div>
                      <div className="text-gray-400 text-sm">{formatDayDate(today)}, 10:00 - 12:00 PM</div>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">Implement new feature with no interruptions</div>
                  </div>
                  
                  {/* Time block - blue */}
                  <div className="bg-gray-800/80 p-3 rounded-lg border-l-4 border-blue-500">
                    <div className="flex justify-between">
                      <div className="text-white font-medium">Client Meeting</div>
                      <div className="text-gray-400 text-sm">{formatDayDate(tomorrow)}, 1:00 - 2:00 PM</div>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">Presentation of quarterly results</div>
                  </div>

                  {/* Time block - green */}
                  <div className="bg-gray-800/80 p-3 rounded-lg border-l-4 border-green-500">
                    <div className="flex justify-between">
                      <div className="text-white font-medium">Product Review</div>
                      <div className="text-gray-400 text-sm">{formatDayDate(dayAfterTomorrow)}, 11:00 - 12:00 PM</div>
                    </div>
                    <div className="text-gray-400 text-sm mt-1">Monthly product roadmap review</div>
                  </div>
                  
                  {/* Optimized tag */}
                  <div className="absolute -right-4 -top-4 bg-gradient-to-r from-teal-500 to-primary-500 rounded-full py-1 px-3 text-white text-xs font-medium shadow-lg transform rotate-3">
                    AI Optimized
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 