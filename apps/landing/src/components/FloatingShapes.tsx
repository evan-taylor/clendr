'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      const size = Math.floor(Math.random() * 60) + 20; // between 20px and 80px - smaller shapes
      const shape = Math.random() > 0.7 ? 'circle' : 'square'; // more squares than circles
      const xPos = Math.random() * 100;
      const yPos = Math.random() * 100;
      const zIndex = Math.floor(Math.random() * 3) - 1;
      const depth = Math.random() * 0.1 + 0.03; // Even more reduced depth for minimal movement
      
      // Much lighter color gradients
      const gradient = [
        'from-primary-100 to-blue-100',
        'from-blue-100 to-teal-100',
        'from-teal-100 to-primary-100',
        'from-gray-100 to-white',
      ][Math.floor(Math.random() * 4)];
      
      const delayMultiplier = Math.random() * 5;
      const durationMultiplier = Math.random() * 15 + 30; // Even longer duration for extremely slow animations
      
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
      if (now - lastTime >= 150) { // Only process every 150ms (increased for even less frequent updates)
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
          className={`absolute ${
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
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.03)',
          }}
          initial={{
            background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            opacity: 0,
          }}
          animate={{
            x: mousePosition.x * shape.depth * 60 * intensity, // Reduced movement
            y: mousePosition.y * shape.depth * 60 * intensity, // Reduced movement
            rotateX: mousePosition.y * 1, // Minimal rotation
            rotateY: -mousePosition.x * 1, // Minimal rotation
            opacity: 0.3, // Very subtle opacity
          }}
          transition={{ type: 'spring', damping: 80, stiffness: 40 }} // Even more damping, less stiffness
        >
          <motion.div
            className={`w-full h-full bg-gradient-to-br ${shape.gradient} opacity-30`} // Very low opacity
            animate={{
              y: [0, 3, 0], // Minimal movement range
              rotate: [0, shape.id % 2 === 0 ? 1 : -1, 0], // Almost no rotation
            }}
            transition={{
              duration: shape.durationMultiplier,
              repeat: Infinity,
              delay: shape.delayMultiplier,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes; 