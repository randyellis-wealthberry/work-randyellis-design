"use client";

import Image from "next/image";
import CircularText from "./circular-text";
import { motion } from "motion/react";

interface AvatarCircularTextProps {
  className?: string;
}

const AvatarCircularText = ({ className = "" }: AvatarCircularTextProps) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <CircularText
        text="AI PRODUCT DESIGN ENGINEER • INNOVATION LEADER • "
        spinDuration={25}
        onHover="speedUp"
        className="w-[240px] h-[240px] md:w-[280px] md:h-[280px]"
        fontSize={13}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden border-4 border-white dark:border-zinc-800">
          <Image
            src="/images/randyellis-official-avatar.png"
            alt="Randy Ellis - AI Product Design Engineer and Innovation Leader specializing in generative AI design tools and systems"
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AvatarCircularText;
