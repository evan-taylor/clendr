import { useRef, useEffect } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'default' | 'gradient' | 'particles' | 'dots';
  intensity?: 'low' | 'medium' | 'high';
}

const AnimatedBackground = ({ 
  className = '', 
  variant = 'default',
  intensity = 'medium'
}: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Particles animation effect
  useEffect(() => {
    if (variant !== 'particles' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
    }> = [];
    
    let animationFrameId: number;
    let width: number;
    let height: number;
    
    // Set particle count based on intensity
    const particleCount = intensity === 'low' ? 20 : intensity === 'medium' ? 40 : 80;
    
    // Setup canvas size
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
    };
    
    // Create particles
    const createParticles = () => {
      particles = [];
      
      const colors = ['#6366f1', '#a855f7', '#14b8a6', '#3b82f6'];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      // Draw connections between close particles
      if (intensity !== 'low') {
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const distance = Math.sqrt(
              Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
            );
            const maxDistance = 150;
            
            if (distance < maxDistance) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / maxDistance)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Handle resize
    const handleResize = () => {
      setupCanvas();
      createParticles();
    };
    
    // Initialize
    setupCanvas();
    createParticles();
    draw();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, intensity]);
  
  // Dots animation effect - more subtle and gentle
  useEffect(() => {
    if (variant !== 'dots' || !dotsCanvasRef.current) return;
    
    const canvas = dotsCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let dots: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];
    
    let animationFrameId: number;
    let width: number;
    let height: number;
    
    // Set dot count based on intensity - keeping it lower for subtlety
    const dotCount = intensity === 'low' ? 15 : intensity === 'medium' ? 30 : 50;
    
    // Setup canvas size
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
    };
    
    // Create dots
    const createDots = () => {
      dots = [];
      
      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1, // Smaller size for subtlety
          speedX: (Math.random() - 0.5) * 0.3, // Slower movement
          speedY: (Math.random() - 0.5) * 0.3, // Slower movement
          opacity: Math.random() * 0.3 + 0.1, // Lower opacity for subtlety
        });
      }
    };
    
    // Draw dots
    const drawDots = () => {
      ctx.clearRect(0, 0, width, height);
      
      dots.forEach(dot => {
        // Move dot
        dot.x += dot.speedX;
        dot.y += dot.speedY;
        
        // Wrap around screen edges
        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;
        
        // Draw dot
        const color = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark' 
          ? `rgba(255, 255, 255, ${dot.opacity})` 
          : `rgba(99, 102, 241, ${dot.opacity})`; // primary-600 color with opacity
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
      
      // Connect nearby dots with subtle lines
      dots.forEach((dot, i) => {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dot.x - dots[j].x;
          const dy = dot.y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) { // Only connect relatively close dots
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(dots[j].x, dots[j].y);
            
            const opacity = (1 - distance / 80) * 0.1; // Lower line opacity
            const lineColor = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(99, 102, 241, ${opacity})`;
              
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = window.requestAnimationFrame(drawDots);
    };
    
    // Handle window resize
    const handleResize = () => {
      setupCanvas();
      createDots();
    };
    
    // Initialize
    setupCanvas();
    createDots();
    drawDots();
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, intensity]);
  
  // Render different background variants
  const renderBackground = () => {
    switch (variant) {
      case 'dots':
        return (
          <>
            <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>
            <canvas
              ref={dotsCanvasRef}
              className="absolute inset-0 z-0"
              style={{ opacity: 0.7 }}
            />
          </>
        );
      case 'particles':
        return (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
            style={{ mixBlendMode: 'lighten', opacity: 0.6 }}
          />
        );
      case 'gradient':
        return (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-teal-600/5 to-green-600/10 animate-gradient-y-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-primary-600/5 to-teal-600/10 animate-gradient-x-slow"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white dark:from-gray-900/30 dark:to-gray-900"></div>
            
            {/* Animated gradient circles - slowed down */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary-400/10 dark:bg-primary-800/10 animate-pulse-very-slow"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-teal-400/10 dark:bg-teal-800/10 animate-pulse-very-slow animation-delay-2000"></div>
            <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-green-400/10 dark:bg-green-800/10 animate-pulse-very-slow animation-delay-4000"></div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
          </div>
        );
    }
  };
  
  return (
    <div className={`${className} absolute inset-0 overflow-hidden`}>
      {renderBackground()}
    </div>
  );
};

export default AnimatedBackground; 