import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground = ({ className = '' }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Sophisticated particle animation effect - client-side only
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Array<{
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
    let mousePosX = 0;
    let mousePosY = 0;
    let mouseRadius = 100;
    
    // Set the particle count to be subtle but effective
    const particleCount = 100;
    
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
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.1, // Very small particles for subtlety
          speedX: (Math.random() - 0.5) * 0.1, // Very slow movement
          speedY: (Math.random() - 0.5) * 0.1, // Very slow movement
          opacity: Math.random() * 0.3 + 0.1, // Low opacity for subtlety
        });
      }
    };
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    };
    
    // Draw all particles and connections
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update particle position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Handle boundary conditions - wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        // Calculate distance to mouse
        const dx = mousePosX - p.x;
        const dy = mousePosY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Repel from mouse
        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseRadius - distance) / mouseRadius;
          
          p.x -= Math.cos(angle) * force * 1;
          p.y -= Math.sin(angle) * force * 1;
        }
        
        // Draw particle - subtle white/gray dots
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }
      
      // Draw connections between close particles - creates a web-like effect
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
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
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden ${className}`}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-zinc-950 bg-gradient-to-b from-zinc-900 to-zinc-950"></div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      
      {/* Noise texture */}
      <div className="noise-overlay"></div>
      
      {/* Moving gradient orbs for depth */}
      <motion.div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-zinc-800/5 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-zinc-800/5 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Canvas for particles */}
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
};

export default AnimatedBackground;