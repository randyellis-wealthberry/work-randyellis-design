"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ExternalLink, BarChart3, TestTube, ArrowLeft } from "lucide-react";

const cardData = [
  {
    id: "sitemap",
    title: "Information Architecture",
    label: "View Sitemap",
    url: "https://miro.com/app/board/o9J_kwGbK00=/",
    openInNewTab: true,
    icon: "🗺️",
    cursorIcon: ExternalLink,
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center",
    imageAlt: "Sitemap and wireframe architecture",
  },
  {
    id: "usability-test",
    title: "Usability Test",
    label: "Take Test",
    url: "https://t.maze.co/159918816",
    openInNewTab: true,
    icon: "🧪",
    cursorIcon: TestTube,
    imageUrl:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center",
    imageAlt: "Usability testing interface",
  },
  {
    id: "usability-report",
    title: "Test Results",
    label: "View Report",
    url: "https://app.maze.co/report/Addvance-v1-WIP/bxqeilh40ohf5/intro",
    openInNewTab: true,
    icon: "",
    cursorIcon: BarChart3,
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center",
    imageAlt: "Analytics and test results dashboard",
  },
  {
    id: "return-projects",
    title: "More Projects",
    label: "View Projects",
    url: "/projects",
    openInNewTab: false,
    icon: "←",
    cursorIcon: ArrowLeft,
    imageUrl:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop&crop=center",
    imageAlt: "Portfolio projects showcase",
  },
];

// Interactive Cursor Card Component (Cursor component removed - simplified version)
function InteractiveCursorCard({ card }: { card: (typeof cardData)[0] }) {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (card.openInNewTab) {
      window.open(card.url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = card.url;
    }
  };

  return (
    <div className="relative flex h-[300px] w-full items-center justify-center">
      {/* Cursor component removed - doesn't exist */}

      <div
        ref={targetRef}
        className="relative cursor-pointer"
        onClick={handleClick}
      >
        <div className="group relative">
          <Image
            src={card.imageUrl}
            alt={card.imageAlt}
            width={288}
            height={192}
            className="border-border h-48 w-full max-w-72 rounded-xl border object-cover transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
          />

          {/* Overlay with title and icon */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute right-4 bottom-4 left-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            </div>
            <p className="text-sm text-white/80">
              {card.id === "sitemap" &&
                "Interactive wireframes and information architecture"}
              {card.id === "usability-test" &&
                "Test the user experience and provide feedback"}
              {card.id === "usability-report" &&
                "View comprehensive testing results and insights"}
              {card.id === "return-projects" &&
                "Explore more projects and case studies"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrototypeScenarioGrid() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Design Artifacts & Testing Resources
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-center text-lg">
            Explore the interactive prototypes and testing materials from the
            Innovation Lab. Each resource provides insight into the design
            process and user research methodology.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {cardData.map((card) => (
            <InteractiveCursorCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
