'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FloatingShapesProps {
  className?: string;
  count?: number;
  intensity?: number;
}

const FloatingShapes = ({ className = '', count = 5, intensity = 0.02 }: FloatingShapesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Generate shapes after component mounts to ensure server/client consistency
  useEffect(() => {
    // Only run on the client
    setIsMounted(true);
    
    // Create shapes
    const generatedShapes = Array.from({ length: count }).map((_, index) => {
      const size = Math.floor(Math.random() * 70) + 30; // between 30px and 100px
      const shape = Math.random() > 0.5 ? 'circle' : 'square';
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      const zIndex = Math.floor(Math.random() * 3) - 1;
      const depth = Math.random() * 0.15 + 0.05; // Reduced depth for less movement
      const gradient = [
        'from-primary-500 to-teal-500',
        'from-teal-500 to-blue-500',
        'from-blue-500 to-green-500',
        'from-green-500 to-primary-500',
      ][Math.floor(Math.random() * 4)];
      
      const delayMultiplier = Math.random() * 5;
      const durationMultiplier = Math.random() * 10 + 20; // Increased duration for much slower animations
      
      return {
        id: index,
        size,
        shape,
        xPos,
        yPos,
        zIndex,
        depth,
        gradient,
        delayMultiplier,
        durationMultiplier,
      };
    });
    
    setShapes(generatedShapes);
  }, [count]);
  
  // Mouse parallax effect - throttled to improve performance
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      // Use requestAnimationFrame to throttle updates
      requestAnimationFrame(() => {
        setMousePosition({ x, y });
      });
    };
    
    // Throttle the event listener
    let lastTime = 0;
    const throttledHandler = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime >= 100) { // Only process every 100ms (increased from 50ms)
        lastTime = now;
        handleMouseMove(e);
      }
    };
    
    window.addEventListener('mousemove', throttledHandler);
    
    return () => {
      window.removeEventListener('mousemove', throttledHandler);
    };
  }, []);
  
  // Don't render anything on the server or until mounted on client
  if (!isMounted) {
    return <div className={`${className} absolute inset-0 overflow-hidden pointer-events-none`}></div>;
  }
  
  return (
    <div
      ref={containerRef}
      className={`${className} absolute inset-0 overflow-hidden pointer-events-none`}
    >
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute opacity-70 backdrop-blur-sm ${
            shape.shape === 'circle' ? 'rounded-full' : 'rounded-xl'
          }`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.xPos}%`,
            top: `${shape.yPos}%`,
            zIndex: shape.zIndex,
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
          }}
          initial={{
            background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            opacity: 0,
          }}
          animate={{
            x: mousePosition.x * shape.depth * 100 * intensity,
            y: mousePosition.y * shape.depth * 100 * intensity,
            rotateX: mousePosition.y * 3, // Significantly reduced rotation angle
            rotateY: -mousePosition.x * 3, // Significantly reduced rotation angle
            opacity: 0.5, // Reduced opacity
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 60 }} // Much more damping, even less stiffness
        >
          <motion.div
            className={`w-full h-full bg-gradient-to-br ${shape.gradient} opacity-50`} // Further reduced opacity
            animate={{
              y: [0, 5, 0], // Significantly reduced movement range
              rotate: [0, shape.id % 2 === 0 ? 2 : -2, 0], // Significantly reduced rotation angle
            }}
            transition={{
              duration: shape.durationMultiplier,
              repeat: Infinity,
              delay: shape.delayMultiplier,
              ease: "easeInOut" // Added easing for smoother animation
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes; 