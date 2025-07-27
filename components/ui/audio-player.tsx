"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  FileText,
  ChevronUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import Image from "next/image";

const formatTime = (seconds: number = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

interface AudioPlayerProps {
  src?: string;
  cover?: string;
  title?: string;
  script?: string;
  className?: string;
}

export function AudioPlayer({
  src = "/audio/randys-story.mp3",
  cover = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  title = "The Designer Who Couldn't Stop Solving Problems: Randy's Story",
  script = `Picture this: While others were debating whether empathy belonged in tech, Randy was already 20 years deep into proving it was the secret sauce. Not just talking about it—living it, breathing it, and building companies around it.

In 2013, when "design thinking" was still fighting for a seat at the table, Randy didn't just get a seat—he built his own table. His first venture didn't just attract venture capital; it reimagined how local merchants could thrive in a digital world. The result? A blueprint for empathy-driven innovation that still influences how we think about user experience today.

What does design mean to you?

Forget everything you think you know about design. It's not decoration. It's not making things "look nice." Design is strategic problem-solving on steroids—it's the art of making life flow better without anyone noticing you did anything at all.

Think of it this way: Great design is like a perfectly choreographed dance where the user never trips, never questions the next step, and arrives at their destination thinking, "That was delightful." It's empathy weaponized as innovation, pragmatism dressed up as creativity, and the relentless pursuit of "What if life could be just a little bit easier?"

The best part? When you nail it, nobody thanks you—because they never knew there was a problem to solve in the first place.

Here's the truth most designers won't tell you:

Good designers are problem detectives. They'll investigate every angle, test every hypothesis, and deliver solid solutions. They're the reliable professionals who dot every i and cross every t.

But great designers? They're problem prophets.

Great designers don't just solve the problem in front of them—they see how that problem connects to the next five problems you haven't even discovered yet. They're opinionated visionaries who can defend every pixel placement with the passion of a trial lawyer and the precision of a surgeon. They're generalists who speak developer, marketer, and CEO fluently. Most importantly, they're more in love with the problem than their own solutions.

Two years of freelancing wasn't a fallback—it was strategic reconnaissance. As a former funded CEO turned design consultant, Randy brought something rare to the table: the ability to see design through the lens of business strategy, technical feasibility, and user delight simultaneously.

But here's the plot twist: The goal was never to fly solo forever. Those 16 months of agency work and client consultancy? That was gathering intel, sharpening tools, and preparing for the real mission—joining forces with a team where 1+1 equals 10.

Because let's be honest: Solo designers make ripples. Teams make waves.

Every project follows the same rhythm:

Step 1: The Hunt - Become a detective. Interview stakeholders like they're witnesses to a crime (the crime of bad user experience). Study users like an anthropologist. Analyze competitors like a spy. This isn't just research—it's archaeological excavation of human needs.

Step 2: The Craft - This is where most designers think the work begins. Wrong. By now, you should know exactly what dragon you're slaying. Cast a wide net of solutions, then ruthlessly edit through testing. Translate wireframes into living, breathing prototypes. Make friends with developers early—they're not the enemy, they're your co-conspirators in bringing dreams to life.

Step 3: The Guardian - The design is "done"? Cute. Now you become the guardian angel of implementation. Available, supportive, protective of the vision while flexible on the details. This is where good ideas become great products.

This isn't just a designer's story. It's a blueprint for how to think about problems, solutions, and the humans caught in between. It's proof that empathy isn't soft—it's strategic. That design isn't decoration—it's destiny.

And after 20+ years, Randy's just getting started.

Because the future of design isn't just about making things work. It's about making life work better.`,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isScriptOpen, setIsScriptOpen] = useState(false);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isFinite(progress) ? progress : 0);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration;
      if (isFinite(time)) {
        audioRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const openScript = () => {
    setIsScriptOpen(true);
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10,
      );
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10,
      );
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isScriptOpen) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
        case "Escape":
          setIsScriptOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScriptOpen, togglePlay]);

  if (!src) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={cn(
            "relative flex flex-col mx-auto rounded-2xl overflow-hidden bg-background/95 backdrop-blur-sm border border-border shadow-lg p-4 w-full max-w-md",
            className,
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          layout
        >
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            src={src}
            className="hidden"
            preload="metadata"
          />

          <motion.div
            className="flex flex-col relative space-y-4"
            layout
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Cover */}
            {cover && (
              <motion.div className="bg-muted overflow-hidden rounded-xl h-[200px] w-full relative">
                <Image
                  src={cover}
                  alt="Audio cover"
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* Title and Script Button */}
            <div className="flex items-center justify-between">
              {title && (
                <motion.h3 className="text-foreground font-semibold text-lg flex-1 pr-2">
                  {title}
                </motion.h3>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openScript}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 shrink-0"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Progress Slider */}
            <motion.div className="flex flex-col gap-y-2">
              <Slider
                value={[progress]}
                onValueChange={(values) => handleSeek(values[0])}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div className="flex items-center justify-center w-full">
              <div className="flex items-center gap-1 bg-muted/50 rounded-full p-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShuffle();
                    }}
                    className={cn(
                      "text-muted-foreground hover:text-foreground h-8 w-8 rounded-full",
                      isShuffle && "text-primary",
                    )}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipBackward}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipForward}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRepeat();
                    }}
                    className={cn(
                      "text-muted-foreground hover:text-foreground h-8 w-8 rounded-full",
                      isRepeat && "text-primary",
                    )}
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Script Drawer */}
      <Drawer open={isScriptOpen} onOpenChange={setIsScriptOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {title} - Read Along
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-6 py-6 overflow-y-auto flex justify-center">
            <div className="max-w-2xl text-left">
              {script?.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-6 leading-relaxed text-foreground text-base selection:bg-primary/20 selection:text-foreground"
                  style={{ backgroundColor: "transparent" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="sticky bottom-0 bg-background border-t p-4">
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                onClick={() => setIsScriptOpen(false)}
                className="flex items-center gap-2"
              >
                <ChevronUp className="h-4 w-4" />
                Close Script
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
