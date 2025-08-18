"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MagneticButton,
  LiquidButton,
  ParticleButton,
  GradientButton,
  RippleButton,
} from "./index";
import { Brain, Network, Download, Calendar, Users } from "lucide-react";

export function AnimatedButtonShowcase() {
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked!`);
    // You can add actual functionality here
  };

  return (
    <section className="from-muted/30 via-background to-muted/20 bg-gradient-to-br px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">
            Interactive Button Showcase
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Innovation Lab demonstration of modern interaction patterns for
            professional interfaces. Each button showcases different animation
            techniques optimized for engagement and accessibility.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-2">
          {/* Magnetic Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <MagneticButton
              onClick={() => handleButtonClick("Career Intelligence")}
              aria-label="Launch Career Intelligence Platform"
            >
              <Brain className="h-5 w-5" />
              Career Intelligence
            </MagneticButton>
            <p className="text-muted-foreground text-center text-sm">
              Magnetic cursor follow with 3D rotation
            </p>
          </motion.div>

          {/* Liquid Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <LiquidButton
              onClick={() => handleButtonClick("Network Analysis")}
              aria-label="Start Network Analysis"
              liquidColor="#06b6d4"
            >
              <Network className="h-5 w-5" />
              Network Analysis
            </LiquidButton>
            <p className="text-muted-foreground text-center text-sm">
              Liquid morphing with SVG turbulence
            </p>
          </motion.div>

          {/* Particle Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <ParticleButton
              onClick={() => handleButtonClick("Download Case Study")}
              aria-label="Download Case Study PDF"
            >
              <Download className="h-5 w-5" />
              Download Case Study
            </ParticleButton>
            <p className="text-muted-foreground text-center text-sm">
              Particle burst effects on interaction
            </p>
          </motion.div>

          {/* Gradient Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <GradientButton
              onClick={() => handleButtonClick("Schedule Demo")}
              aria-label="Schedule a product demo"
            >
              <Calendar className="h-5 w-5" />
              Schedule Demo
            </GradientButton>
            <p className="text-muted-foreground text-center text-sm">
              Aurora gradient shift animation
            </p>
          </motion.div>

          {/* Ripple Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <RippleButton
              onClick={() => handleButtonClick("Join Innovation Lab")}
              aria-label="Join the Innovation Lab"
              showSuccess={true}
            >
              <Users className="h-5 w-5" />
              Join Innovation Lab
            </RippleButton>
            <p className="text-muted-foreground text-center text-sm">
              Ripple effect with success feedback
            </p>
          </motion.div>
        </div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-card mt-16 rounded-xl border p-6"
        >
          <h3 className="mb-4 text-lg font-semibold">
            Technical Implementation
          </h3>
          <div className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-2">
            <div className="flex items-start gap-2">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Performance Optimized</p>
                <p className="text-muted-foreground">
                  60fps animations with GPU acceleration
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Accessibility First</p>
                <p className="text-muted-foreground">
                  ARIA labels, keyboard navigation, focus states
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Motion Preferences</p>
                <p className="text-muted-foreground">
                  Respects prefers-reduced-motion settings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Theme Compatible</p>
                <p className="text-muted-foreground">
                  Adapts to light/dark mode automatically
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Responsive Design</p>
                <p className="text-muted-foreground">
                  Touch-friendly on all devices
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Test Coverage</p>
                <p className="text-muted-foreground">
                  100% test coverage with TDD approach
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
