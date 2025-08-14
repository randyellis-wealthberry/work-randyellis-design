"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  BarChart3,
  Network,
  Target,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

// Motion Primitives Disclosure Components
import {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
} from "@/components/motion-primitives/disclosure";

// Utility functions
import {
  generateResourceCardImages,
  DEFAULT_RESOURCE_CARDS,
  type ResourceCard,
} from "@/lib/utils/random-image-generator";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Icon mapping for resource cards
const ICON_MAP = {
  "maze-testing": BarChart3,
  "miro-board": Network,
  "addvance-report": Target,
  "more-projects": ArrowRight,
};

interface ProjectResourcesSectionProps {
  className?: string;
}

/**
 * Individual Resource Card Component
 * Uses disclosure pattern for expandable content
 */
interface ResourceCardProps {
  card: ResourceCard;
  imageUrl: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function ResourceCard({
  card,
  imageUrl,
  isExpanded,
  onToggle,
}: ResourceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const IconComponent = ICON_MAP[card.id as keyof typeof ICON_MAP];

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  // Generate unique IDs for accessibility
  const cardId = `resource-card-${card.id}`;
  const contentId = `resource-content-${card.id}`;

  return (
    <Disclosure open={isExpanded} onOpenChange={onToggle}>
      <Card
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg min-h-11"
        data-testid={cardId}
      >
        <DisclosureTrigger>
          <div
            id={cardId}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            tabIndex={0}
          >
            {/* Image Section */}
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
              {!imageError && imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={`Abstract art representing ${card.title} - Visual preview for ${card.description}`}
                    fill
                    className={cn(
                      "object-cover transition-all duration-500 group-hover:scale-105",
                      imageLoaded ? "opacity-100" : "opacity-0",
                    )}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Loading overlay */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 animate-pulse" />
                  )}

                  {/* Icon overlay */}
                  <div className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-zinc-800/90 rounded-lg backdrop-blur-sm">
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                    )}
                  </div>

                  {/* External link indicator */}
                  {card.isExternal && (
                    <div className="absolute bottom-4 right-4 p-1.5 bg-blue-500/90 rounded-md">
                      <ExternalLink className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                // Fallback when image fails to load or no imageUrl available
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                  {IconComponent && (
                    <IconComponent className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                  )}
                  {!imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 animate-pulse" />
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <Badge
                  variant={card.isExternal ? "default" : "secondary"}
                  className="ml-2 text-xs"
                >
                  {card.isExternal ? "External" : "Internal"}
                </Badge>
              </div>

              {/* Expand indicator */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Click to {isExpanded ? "collapse" : "expand"}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="h-4 w-4 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </div>
            </CardContent>
          </div>
        </DisclosureTrigger>

        {/* Expandable Content */}
        <DisclosureContent>
          <div
            id={contentId}
            className="px-4 pb-4 border-t border-zinc-200 dark:border-zinc-700"
            aria-labelledby={cardId}
          >
            <div className="pt-4 space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {card.description}
              </p>

              {/* Action Link */}
              <div className="flex justify-end">
                {card.isExternal ? (
                  <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label={`Open ${card.title} in new tab`}
                  >
                    Open Resource
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={card.url}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 dark:bg-zinc-200 hover:bg-zinc-900 dark:hover:bg-zinc-300 text-white dark:text-zinc-800 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                    aria-label={`Navigate to ${card.title}`}
                  >
                    {card.title.includes("Projects")
                      ? "Browse Projects"
                      : "View Resource"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DisclosureContent>
      </Card>
    </Disclosure>
  );
}

/**
 * Main Project Resources Section Component
 * Displays resource cards in a responsive grid with disclosure functionality
 */
export function ProjectResourcesSection({
  className,
}: ProjectResourcesSectionProps) {
  const [cardImages, setCardImages] = useState<Record<string, string>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );

  // Initialize with actual icons
  const resourceCards: ResourceCard[] = DEFAULT_RESOURCE_CARDS.map((card) => ({
    ...card,
    icon: ICON_MAP[card.id as keyof typeof ICON_MAP],
  }));

  // Generate random images on component mount
  useEffect(() => {
    const images = generateResourceCardImages(resourceCards);
    setCardImages(images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to ensure images don't change during usage

  // Toggle card expansion
  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <section
      className={cn("px-6 py-16 lg:px-8 bg-muted/20", className)}
      data-testid="project-resources-section"
      aria-labelledby="resources-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            id="resources-heading"
            className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4"
          >
            Project Resources & Documentation
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Explore the comprehensive research, testing, and design materials
            that shaped the Addvanced project. Each resource provides detailed
            insights into our methodology and findings.
          </p>
        </div>

        {/* Resource Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          data-testid="resources-grid"
        >
          {resourceCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: resourceCards.indexOf(card) * 0.1,
              }}
            >
              <ResourceCard
                card={card}
                imageUrl={cardImages[card.id] || ""}
                isExpanded={expandedCards[card.id] || false}
                onToggle={() => toggleCard(card.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            All external resources open in new tabs for seamless browsing.
            Images are dynamically generated for visual variety on each page
            load.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProjectResourcesSection;
