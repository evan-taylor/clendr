import { ReactNode, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  title: ReactNode;
  subtitle: string;
  className?: string;
}

export const Hero = ({ title, subtitle, className = '' }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Text reveal animations
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1.0]
      }
    })
  };

  // Staggered item animations
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6 + (i * 0.1),
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  // Layer parallax animations
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, 30]);
  
  return (
    <section ref={containerRef} id="hero" className={`relative overflow-hidden ${className}`}>
      {/* Background elements with subtle parallax */}
      <motion.div style={{ y: layer1Y }} className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-zinc-800/5 blur-3xl"></motion.div>
      <motion.div style={{ y: layer2Y }} className="absolute -top-20 left-20 w-80 h-80 rounded-full bg-zinc-700/5 blur-3xl"></motion.div>
      <motion.div style={{ y: layer3Y }} className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-zinc-800/5 blur-3xl"></motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero title with sophisticated styling */}
          <motion.h1 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 text-shadow-lg"
          >
            {title}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {subtitle}
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <a 
              href="waitlist" 
              className="btn-primary px-8 py-3 text-base"
              data-cursor-text="Get Early Access"
              data-cursor-variant="hover"
            >
              Get Early Access
            </a>
            <a 
              href="#how-it-works" 
              className="btn-secondary px-8 py-3 text-base"
              data-cursor-text="Learn More"
            >
              Learn More
            </a>
          </motion.div>
          
          {/* Demo visualization */}
          <motion.div 
            className="mt-16 relative"
            style={{ y, opacity }}
          >
            <div className="relative shadow-subtle rounded-xl overflow-hidden">
              {/* App mockup - elegant minimalist version */}
              <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                  </div>
                </div>
                <div className="pt-8 h-full w-full bg-zinc-900 relative">
                  <div className="absolute inset-0 bg-grid opacity-10"></div>
                  <div className="glass-highlight"></div>
                  
                  <div className="absolute top-4 left-4 right-4 bottom-4">
                    <div className="h-full w-full rounded-lg glass-effect-dark flex flex-col">
                      <div className="border-b border-zinc-800 p-3 flex items-center justify-between">
                        <div className="text-sm text-zinc-400">Calendar</div>
                        <div className="flex space-x-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                          <div className="text-xs text-zinc-500">March 2025</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-3 grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`aspect-square text-xs p-1 rounded flex flex-col ${
                              i % 7 === 0 || i % 7 === 6 
                                ? 'bg-zinc-800/30' 
                                : i === 15 
                                  ? 'bg-[#7dd3f6] text-zinc-900' 
                                  : 'bg-zinc-800/10'
                            }`}
                          >
                            <span className="mb-1">{i + 1}</span>
                            {i === 10 && <div className="h-1 w-full bg-zinc-700/50 rounded-full mt-auto"></div>}
                            {i === 15 && <div className="h-1 w-full bg-zinc-900/20 rounded-full mt-auto"></div>}
                            {i === 22 && <div className="h-1 w-full bg-[#7dd3f6]/50 rounded-full mt-auto"></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Removed floating elements that were causing overlay issues */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;