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
        text="FRACTIONAL CHIEF DESIGN OFFICER • AI PRODUCT DESIGN ENGINEER • STARTUP LEADERSHIP • "
        spinDuration={25}
        onHover="speedUp"
        className="h-[240px] w-[240px] md:h-[280px] md:w-[280px]"
        fontSize={13}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="relative h-[140px] w-[140px] overflow-hidden rounded-full border-4 border-white md:h-[160px] md:w-[160px] dark:border-zinc-800">
          <Image
            src="/images/randyellis-official-avatar.png"
            alt="Randy Ellis - Fractional Chief Design Officer & AI Product Design Engineer specializing in startup design leadership, venture-backed design strategy, and scalable design systems. Available for fractional CDO engagements through Chameleon Collective and Go Fractional platforms."
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
