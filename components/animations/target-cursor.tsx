"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

interface TargetCursorProps {
  className?: string;
  size?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export function TargetCursor({ 
  className, 
  size = 40,
  springConfig = {
    stiffness: 250,
    damping: 25,
    mass: 0.2
  }
}: TargetCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
      setIsVisible(true);
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches('button, a, [role="button"], [tabindex], input, textarea, select');
      setIsHovering(isInteractive);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, size]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={cursorRef}
          data-testid="target-cursor"
          className={cn(
            "fixed pointer-events-none z-[9999] mix-blend-difference",
            className
          )}
          style={{
            x: springX,
            y: springY,
            width: size,
            height: size,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isHovering ? 1.5 : 1, 
            opacity: 1 
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: springConfig.stiffness,
            damping: springConfig.damping,
            mass: springConfig.mass,
          }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            animate={{
              scale: isHovering ? 0.8 : 1,
              rotate: 360,
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 30
              }
            }}
          />
          
          {/* Inner dot */}
          <motion.div
            className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full"
            animate={{
              scale: isHovering ? 1.5 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
          />
          
          {/* Cross hair lines */}
          <motion.div
            className="absolute top-1/2 left-0 w-full h-0.5 bg-white origin-center"
            style={{ transform: 'translateY(-50%)' }}
            animate={{
              scaleX: isHovering ? 0.6 : 1,
              opacity: isHovering ? 0.7 : 1,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-0 h-full w-0.5 bg-white origin-center"
            style={{ transform: 'translateX(-50%)' }}
            animate={{
              scaleY: isHovering ? 0.6 : 1,
              opacity: isHovering ? 0.7 : 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}