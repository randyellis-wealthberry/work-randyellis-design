"use client";
import { useEffect } from "react";

const GAME = "/ghosted/index.html";
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

function coinSfx() {
  try {
    const ac = new AudioContext();
    [
      [1046, 0],
      [1568, 0.07],
    ].forEach(([f, t0]) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "square";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.15, ac.currentTime + t0);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t0 + 0.14);
      o.connect(g).connect(ac.destination);
      o.start(ac.currentTime + t0);
      o.stop(ac.currentTime + t0 + 0.16);
    });
  } catch {
    /* no audio, still open */
  }
}

function play() {
  coinSfx();
  setTimeout(() => window.open(GAME, "_blank", "noopener"), 180);
}

export function GhostedCoin() {
  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.matches?.("input,textarea,[contenteditable]")
      )
        return;
      i = e.code === KONAMI[i] ? i + 1 : e.code === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        play();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={play}
      aria-label="Insert coin"
      title="Insert coin"
      className="ghosted-coin inline-block size-3 rounded-full bg-amber-400 opacity-40 shadow-[inset_0_0_0_2px_#b45309] transition-opacity hover:opacity-100 focus-visible:opacity-100"
    />
  );
}
