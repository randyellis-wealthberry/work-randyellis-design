"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  onMagneticMove?: (x: number, y: number) => void;
}

export function MagneticWrapper({
  children,
  className,
  strength = 0.3,
  springConfig = {
    stiffness: 150,
    damping: 15,
    mass: 0.1
  },
  onMagneticMove
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const dampedMouseX = useSpring(mouseX, springConfig);
  const dampedMouseY = useSpring(mouseY, springConfig);
  
  const transformX = useTransform(dampedMouseX, (value) => value * strength);
  const transformY = useTransform(dampedMouseY, (value) => value * strength);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Calculate distance from center for falloff
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
      const falloff = Math.max(0, 1 - distance / maxDistance);
      
      const adjustedX = deltaX * falloff;
      const adjustedY = deltaY * falloff;
      
      mouseX.set(adjustedX);
      mouseY.set(adjustedY);
      
      onMagneticMove?.(adjustedX, adjustedY);
    };
    
    const handleMouseEnter = () => {
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      mouseX.set(0);
      mouseY.set(0);
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, strength, onMagneticMove]);
  
  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        x: transformX,
        y: transformY,
      }}
      animate={{
        scale: isHovering ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: springConfig.stiffness * 2,
        damping: springConfig.damping * 2,
      }}
    >
      {children}
    </motion.div>
  );
}