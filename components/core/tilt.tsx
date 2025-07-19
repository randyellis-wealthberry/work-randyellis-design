"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

interface TiltProps {
  children: React.ReactNode;
  rotationFactor?: number;
  isRevese?: boolean;
  className?: string;
}

export function Tilt({
  children,
  rotationFactor = 10,
  isRevese = false,
  className = "",
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const calcRotateX = ((y - centerY) / centerY) * rotationFactor;
    const calcRotateY = ((x - centerX) / centerX) * rotationFactor;

    const actualRotateX = isRevese ? calcRotateX : -calcRotateX;
    const actualRotateY = isRevese ? -calcRotateY : calcRotateY;

    setRotateX(actualRotateX);
    setRotateY(actualRotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
