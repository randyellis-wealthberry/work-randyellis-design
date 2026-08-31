"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WaveformPlayerProps {
  audioSrc: string;
  width?: number;
  height?: number;
  className?: string;
}

const BAR_COUNT = 40;

// Deterministic per-bar height so server and client render identical markup.
function barHeight(index: number, height: number): number {
  const seed = Math.sin((index + 1) * 12.9898) * 43758.5453;
  const fraction = seed - Math.floor(seed);
  return 10 + fraction * (height - 20);
}

export default function WaveformPlayer({
  audioSrc,
  width = 400,
  height = 60,
  className,
}: WaveformPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Audio is a browser-only constructor, so it can't live in render/useState.
  React.useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    audio.currentTime = (clickX / rect.width) * audio.duration;
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        role="progressbar"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="relative w-full cursor-pointer overflow-hidden rounded-md"
        style={{ width, height, maxWidth: "100%" }}
        onClick={handleSeek}
      >
        <div className="absolute inset-0 flex items-center justify-between px-0.5">
          {Array.from({ length: BAR_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-sm bg-black dark:bg-white"
              style={{
                width: 2,
                height: `${barHeight(idx, height)}px`,
              }}
            />
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-full rounded-md bg-black/20 dark:bg-white/20"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Button
        onClick={togglePlay}
        className="w-20 px-2 py-1 text-sm"
        variant="outline"
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  );
}
