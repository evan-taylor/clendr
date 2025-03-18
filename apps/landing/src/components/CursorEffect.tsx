import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

interface CursorEffectProps {
  enabled?: boolean;
}

const CursorEffect = ({ enabled = true }: CursorEffectProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState('default');
  
  // Mouse position for cursor effects
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Spring physics for smoother cursor following
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // For geometric shapes
  const rotationValue = useMotionValue(0);
  const rotationSpring = useSpring(rotationValue, { damping: 20, stiffness: 150 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled || !isMounted) return;
    
    // Hide the default cursor
    document.documentElement.classList.add('hide-cursor');
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      if (!isVisible) {
        setIsVisible(true);
      }
      
      // Subtle rotation effect based on mouse movement
      rotationValue.set(e.movementX * 0.2);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    // Track hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for data attributes that might provide custom cursor text or variant
      const cursorTextAttr = target.getAttribute('data-cursor-text');
      const cursorVariantAttr = target.getAttribute('data-cursor-variant');
      
      if (cursorTextAttr) {
        setCursorText(cursorTextAttr);
      } else {
        setCursorText('');
      }
      
      if (cursorVariantAttr) {
        setCursorVariant(cursorVariantAttr);
      } else {
        setCursorVariant('default');
      }
      
      const isInteractive = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        target.classList.contains('interactive') ||
        target.closest('.interactive') !== null;
      
      setIsHovering(isInteractive);
    };
    
    const handleMouseDown = () => {
      setIsClicking(true);
    };
    
    const handleMouseUp = () => {
      setIsClicking(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver as EventListener);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.documentElement.classList.remove('hide-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver as EventListener);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY, enabled, isVisible, isHovering, isMounted, rotationValue]);
  
  // Define cursor variants based on state
  const ringVariants = {
    default: {
      width: 36,
      height: 36,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: '1px',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      opacity: 0.8
    },
    hover: {
      width: 64,
      height: 64,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: '1px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      opacity: 1
    },
    clicking: {
      width: 48,
      height: 48,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      borderWidth: '2px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      opacity: 1,
      scale: 0.9
    },
    text: {
      width: 120,
      height: 40,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: '1px',
      borderRadius: '20px',
      backgroundColor: 'rgba(23, 23, 23, 0.9)',
      opacity: 1
    }
  };
  
  // Don't render anything if disabled or not mounted
  if (!enabled || !isMounted) return null;
  
  // Determine current variant
  let currentVariant = 'default';
  if (isClicking) currentVariant = 'clicking';
  else if (cursorText) currentVariant = 'text';
  else if (isHovering) currentVariant = 'hover';
  else if (cursorVariant !== 'default') currentVariant = cursorVariant;
  
  return (
    <>
      {/* Dot pointer */}
      <motion.div
        className="fixed pointer-events-none z-50 w-2 h-2 rounded-full bg-zinc-100"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isClicking ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          opacity: { duration: 0.3 }
        }}
      />
      
      {/* Geometric ring */}
      <motion.div
        className="fixed pointer-events-none z-40 rounded-full border flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          rotate: rotationSpring
        }}
        variants={ringVariants}
        animate={currentVariant}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 250,
          opacity: { duration: 0.3 }
        }}
      >
        {/* Text inside cursor for text variants */}
        {cursorText && (
          <motion.span 
            className="text-zinc-100 font-medium text-xs whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {cursorText}
          </motion.span>
        )}
        
        {/* Animated hover indicator */}
        {isHovering && !cursorText && (
          <motion.div 
            className="absolute inset-0 rounded-full border border-zinc-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 0.4, 0.1], 
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
      
      {/* Additional geometric element for visual interest */}
      {isHovering && (
        <motion.div
          className="fixed pointer-events-none z-30"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.4,
            scale: 1,
            rotate: 45
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M10 0L20 10L10 20L0 10L10 0Z" 
              fill="rgba(255, 255, 255, 0.2)" 
              strokeWidth="1"
              stroke="rgba(255, 255, 255, 0.5)"
            />
          </svg>
        </motion.div>
      )}
    </>
  );
};

export default CursorEffect;
