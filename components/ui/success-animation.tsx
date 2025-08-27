import React from 'react';
import { motion } from 'motion/react';

interface SuccessAnimationProps {
  className?: string;
  size?: number;
}

export function SuccessAnimation({ className = "", size = 200 }: SuccessAnimationProps) {
  const checkmarkVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { 
          duration: 0.6, 
          ease: "easeInOut" 
        },
        opacity: { 
          duration: 0.2 
        }
      }
    }
  };

  const circleVariants = {
    hidden: {
      scale: 0,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1] // Spring-like easing
      }
    }
  };

  const sparkleVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: 0
    },
    visible: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
      rotate: 360,
      transition: {
        duration: 1,
        times: [0, 0.6, 1],
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ 
        width: size, 
        height: size,
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    >
      {/* Background Circle */}
      <motion.div
        variants={circleVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-lg"
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      />
      
      {/* Success Checkmark */}
      <motion.svg
        width={size * 0.4}
        height={size * 0.4}
        viewBox="0 0 50 50"
        className="relative z-10"
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <motion.path
          d="M14 27l7 7 15-15"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={checkmarkVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>

      {/* Sparkle Effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          variants={sparkleVariants}
          initial="hidden"
          animate="visible"
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            top: `${20 + Math.cos((i * Math.PI * 2) / 6) * 35 + 50}%`,
            left: `${20 + Math.sin((i * Math.PI * 2) / 6) * 35 + 50}%`,
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        />
      ))}
      
      {/* Pulse Ring Effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-green-400"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ 
          scale: [1, 1.4, 1.8],
          opacity: [0.6, 0.3, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "easeOut"
        }}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}