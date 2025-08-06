"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, useEffect } from "react";

interface CaseStudyHeroProps {
  title: string;
  subtitle: string;
  client: string;
  partner: string;
  timeline: string;
  platforms: string[];
  heroImage: string;
  heroVideo?: string;
}

export function CaseStudyHero({
  title,
  subtitle,
  client,
  partner,
  timeline,
  platforms,
  heroImage,
  heroVideo,
}: CaseStudyHeroProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <section className="relative bg-gradient-to-b from-background to-muted/20 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Client
                    </div>
                    <div className="font-semibold">{client}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Partner
                    </div>
                    <div className="font-semibold">{partner}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Timeline
                  </div>
                  <div className="font-semibold">{timeline}</div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Badges */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Platforms</div>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-sm">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image/Video */}
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 10}>
                  {heroVideo && isClient ? (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={heroImage}
                    >
                      <source src={heroVideo} type="video/mp4" />
                      <Image
                        src={heroImage}
                        alt="EchoDrive showcase"
                        fill
                        className="object-cover"
                        priority
                      />
                    </video>
                  ) : (
                    <Image
                      src={heroImage}
                      alt="EchoDrive showcase"
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </AspectRatio>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
