import Image from "next/image";
import {
  AnimatedContent,
  AnimatedContentItem,
} from "@/components/motion-primitives/animated-content";

/**
 * Real employers/clients from Randy's experience. Logos live in /public/logos.
 * Rendered on a white card so both transparent-PNG and dark-text logos stay
 * legible in light and dark mode.
 */
const CLIENTS = [
  { name: "Nagarro", src: "/logos/nagarro.png" },
  { name: "Alight Solutions", src: "/logos/alight-solutions.jpg" },
  { name: "Digitas", src: "/logos/digitas.png" },
  { name: "Ball Horticultural", src: "/logos/ball-horticultural.png" },
  { name: "Eight Bit Studios", src: "/logos/eight-bit-studios.png" },
] as const;

export function ClientLogos() {
  return (
    <div className="w-full">
      <p className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Teams &amp; clients I&apos;ve designed for
      </p>
      <AnimatedContent
        staggerDelay={0.08}
        staggerDirection="bottom"
        distance={12}
      >
        <ul className="flex flex-wrap items-center gap-3">
          {CLIENTS.map((client, index) => (
            <li key={client.name}>
              <AnimatedContentItem
                delay={index * 0.08}
                className="flex h-14 w-32 items-center justify-center rounded-lg bg-white p-3 ring-1 ring-zinc-200/70 dark:ring-zinc-700/60"
              >
                <Image
                  src={client.src}
                  alt={`${client.name} logo`}
                  width={120}
                  height={40}
                  className="max-h-8 w-auto object-contain opacity-80 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
                />
              </AnimatedContentItem>
            </li>
          ))}
        </ul>
      </AnimatedContent>
    </div>
  );
}
