"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Clock,
  Heart,
  DollarSign,
  Check,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Custom Components
import { TextEffect } from "@/components/ui/text-effect";
import { HoverVideo } from "@/components/ui/hover-video";
import { HoverIframe } from "@/components/ui/hover-iframe";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";

// Data
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";

// SpotlightCard Component
const SpotlightCard = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={`relative overflow-hidden ${className || ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.08), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

// Utility function to detect Vimeo URLs
const isVimeoUrl = (url: string): boolean => {
  return url.includes("vimeo.com");
};

// InView wrapper for animations
const InView = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900">
      {/* Spotlight Card Background Effect */}
      <SpotlightCard className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      </SpotlightCard>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="space-y-8">
            <TextEffect
              per="char"
              preset="fade"
              className="text-5xl leading-tight font-bold text-white lg:text-7xl"
            >
              LedgerIQ: Transforming Financial Intelligence
            </TextEffect>

            <InView>
              <div className="space-y-4">
                <p className="text-xl text-slate-300">
                  How I redesigned an enterprise financial platform to increase
                  user productivity by{" "}
                  <span className="font-bold text-emerald-400">40%</span> and
                  reduce processing time by{" "}
                  <span className="font-bold text-emerald-400">60%</span>
                </p>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="outline"
                    className="border-emerald-400 text-emerald-400"
                  >
                    Product Design
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-400 text-blue-400"
                  >
                    UX Research
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-purple-400 text-purple-400"
                  >
                    Enterprise SaaS
                  </Badge>
                </div>
              </div>
            </InView>
          </div>

          {/* Project Preview */}
          <InView>
            <AspectRatio ratio={16 / 10} className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm" />
              <Image
                src="/ledgeriq/dashboard-overview.jpg"
                alt="LedgerIQ Dashboard Preview"
                fill
                className="rounded-2xl object-cover shadow-2xl"
                priority
              />
            </AspectRatio>
          </InView>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30">
          <div className="mt-2 h-3 w-1 animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
};

// Impact Section Component
const ImpactSection = () => {
  const metrics = [
    { value: "40%", label: "Increase in User Productivity", icon: TrendingUp },
    { value: "60%", label: "Reduction in Processing Time", icon: Clock },
    { value: "85%", label: "User Satisfaction Score", icon: Heart },
    { value: "$2.3M", label: "Annual Cost Savings", icon: DollarSign },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <InView>
          <div className="mb-16 text-center">
            <ScrambleSectionTitle
              as="h2"
              className="mb-4 text-4xl font-bold text-slate-900"
            >
              Measurable Impact
            </ScrambleSectionTitle>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              By reimagining the user experience and streamlining complex
              financial workflows, LedgerIQ achieved significant improvements
              across all key performance indicators.
            </p>
          </div>
        </InView>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <InView key={index} delay={index * 0.1}>
              <SpotlightCard>
                <Card className="h-full border-0 p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500">
                    <metric.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-slate-900">
                      {metric.value}
                    </div>
                    <p className="font-medium text-slate-600">{metric.label}</p>
                  </div>
                </Card>
              </SpotlightCard>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};

// Project Details Section Component
const ProjectDetailsSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <InView>
          <div className="mb-16 text-center">
            <ScrambleSectionTitle
              as="h2"
              className="mb-4 text-4xl font-bold text-slate-900"
            >
              Project Deep Dive
            </ScrambleSectionTitle>
            <p className="text-xl text-slate-600">
              Explore the comprehensive design process and technical
              implementation
            </p>
          </div>
        </InView>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-12 grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <InView>
              <div className="grid items-start gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-2xl font-bold text-slate-900"
                  >
                    The Challenge
                  </ScrambleSectionTitle>
                  <p className="leading-relaxed text-slate-600">
                    LedgerIQ&apos;s existing platform suffered from complex
                    navigation, inefficient data visualization, and poor mobile
                    responsiveness, leading to user frustration and decreased
                    productivity.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Key Problems:
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-3">
                        <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                        Complex multi-step workflows taking 15+ clicks
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                        Inconsistent information architecture
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                        Poor data visualization and reporting tools
                      </li>
                    </ul>
                  </div>
                </div>

                <SpotlightCard>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src="/ledgeriq/before-redesign.jpg"
                      alt="LedgerIQ Before Redesign"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="research" className="space-y-8">
            <InView>
              <div className="grid items-start gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-2xl font-bold text-slate-900"
                  >
                    User Research & Discovery
                  </ScrambleSectionTitle>
                  <p className="leading-relaxed text-slate-600">
                    Conducted comprehensive user research including stakeholder
                    interviews, user journey mapping, and competitive analysis
                    to understand pain points and opportunities for improvement.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Research Methods:
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        25+ stakeholder interviews across different roles
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        Comprehensive user journey mapping
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        Competitive analysis of 8 financial platforms
                      </li>
                    </ul>
                  </div>
                </div>

                <SpotlightCard>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src="/ledgeriq/user-research.jpg"
                      alt="User Research Process"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="design" className="space-y-8">
            <InView>
              <div className="grid items-start gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-2xl font-bold text-slate-900"
                  >
                    Design System & Interface
                  </ScrambleSectionTitle>
                  <p className="leading-relaxed text-slate-600">
                    Developed a comprehensive design system with reusable
                    components, consistent visual language, and scalable design
                    tokens that could support the platform&apos;s growth.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Design Deliverables:
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        Component library with 50+ reusable elements
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        High-fidelity desktop and mobile prototypes
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        Interactive prototypes for usability testing
                      </li>
                    </ul>
                  </div>
                </div>

                <SpotlightCard>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src="/ledgeriq/design-system.jpg"
                      alt="Design System Components"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="development" className="space-y-8">
            <InView>
              <div className="grid items-start gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-2xl font-bold text-slate-900"
                  >
                    Technical Implementation
                  </ScrambleSectionTitle>
                  <p className="leading-relaxed text-slate-600">
                    Collaborated closely with engineering teams to implement the
                    design system using modern web technologies, ensuring
                    performance and accessibility standards.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Technologies Used:
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        React & TypeScript for component development
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        Tailwind CSS for responsive styling
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        Storybook for component documentation
                      </li>
                    </ul>
                  </div>
                </div>

                <SpotlightCard>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src="/ledgeriq/development.jpg"
                      alt="Development Process"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="results" className="space-y-8">
            <InView>
              <div className="grid items-start gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-2xl font-bold text-slate-900"
                  >
                    Measurable Outcomes
                  </ScrambleSectionTitle>
                  <p className="leading-relaxed text-slate-600">
                    The redesigned platform delivered significant improvements
                    across all key metrics, resulting in enhanced user
                    satisfaction and business value.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Key Achievements:
                    </h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        40% increase in user productivity
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        60% reduction in task completion time
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                        85% user satisfaction score
                      </li>
                    </ul>
                  </div>
                </div>

                <SpotlightCard>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src="/ledgeriq/results-dashboard.jpg"
                      alt="Results Dashboard"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

// Process Timeline Section Component
const ProcessTimelineSection = () => {
  const timelineSteps = [
    {
      title: "Discovery & Research",
      duration: "3 weeks",
      description:
        "User interviews, stakeholder workshops, competitive analysis",
      deliverables: [
        "User journey maps",
        "Persona definitions",
        "Research synthesis",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Information Architecture",
      duration: "2 weeks",
      description: "Restructuring navigation and content hierarchy",
      deliverables: ["Site map", "User flows", "Content audit"],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Design System",
      duration: "4 weeks",
      description: "Creating scalable components and design tokens",
      deliverables: ["Component library", "Design tokens", "Usage guidelines"],
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "High-Fidelity Design",
      duration: "6 weeks",
      description: "Detailed interface design and prototyping",
      deliverables: [
        "Desktop mockups",
        "Mobile designs",
        "Interactive prototype",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Development & Testing",
      duration: "8 weeks",
      description: "Implementation with continuous user testing",
      deliverables: ["Production code", "Test results", "Performance metrics"],
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="overflow-hidden bg-slate-900 py-24 text-white">
      <div className="container mx-auto px-6">
        <InView>
          <div className="mb-20 text-center">
            <ScrambleSectionTitle as="h2" className="mb-4 text-4xl font-bold">
              Design Process
            </ScrambleSectionTitle>
            <p className="text-xl text-slate-300">
              A systematic approach to solving complex UX challenges
            </p>
          </div>
        </InView>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 h-full w-0.5 -translate-x-px transform bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500" />

          {timelineSteps.map((step, index) => (
            <InView key={index} delay={index * 0.2}>
              <div
                className={`mb-20 flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}
                >
                  <SpotlightCard>
                    <Card className="border-slate-700 bg-slate-800 p-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold">{step.title}</h3>
                          <Badge variant="outline" className="text-slate-300">
                            {step.duration}
                          </Badge>
                        </div>
                        <p className="text-slate-300">{step.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-slate-200">
                            Key Deliverables:
                          </h4>
                          <ul className="space-y-1">
                            {step.deliverables.map((deliverable, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-sm text-slate-400"
                              >
                                <Check className="h-4 w-4 text-emerald-400" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </SpotlightCard>
                </div>

                {/* Timeline Node */}
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <div
                    className={`h-3 w-3 rounded-full bg-gradient-to-r ${step.color}`}
                  />
                </div>

                <div className="w-1/2" />
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};

// Before/After Comparison Section Component
const BeforeAfterSection = () => {
  const [isAfter, setIsAfter] = useState(false);

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-24">
      <div className="container mx-auto px-6">
        <InView>
          <div className="mb-16 text-center">
            <ScrambleSectionTitle
              as="h2"
              className="mb-4 text-4xl font-bold text-slate-900"
            >
              Transformation Results
            </ScrambleSectionTitle>
            <p className="text-xl text-slate-600">
              See the dramatic improvement in user experience design
            </p>
          </div>
        </InView>

        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center space-x-4 rounded-full bg-white p-2 shadow-lg">
              <Button
                variant={!isAfter ? "default" : "ghost"}
                onClick={() => setIsAfter(false)}
                className="rounded-full"
              >
                Before
              </Button>
              <Button
                variant={isAfter ? "default" : "ghost"}
                onClick={() => setIsAfter(true)}
                className="rounded-full"
              >
                After
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={isAfter ? "after" : "before"}
                initial={{ opacity: 0, x: isAfter ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAfter ? -100 : 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <AspectRatio ratio={16 / 10}>
                  <Image
                    src={
                      isAfter
                        ? "/ledgeriq/after-redesign.jpg"
                        : "/ledgeriq/before-redesign.jpg"
                    }
                    alt={`LedgerIQ ${isAfter ? "After" : "Before"} Redesign`}
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
              </motion.div>
            </AnimatePresence>

            {/* Comparison Labels */}
            <div className="absolute top-4 left-4">
              <Badge
                variant={isAfter ? "default" : "secondary"}
                className="text-sm"
              >
                {isAfter ? "After Redesign" : "Before Redesign"}
              </Badge>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-600">
                <X className="h-5 w-5" />
                Before: Key Issues
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Complex navigation with 5+ levels</li>
                <li>• Inconsistent visual hierarchy</li>
                <li>• Poor mobile experience</li>
                <li>• Slow data loading times</li>
                <li>• Limited customization options</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-600">
                <Check className="h-5 w-5" />
                After: Improvements
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Streamlined 2-level navigation</li>
                <li>• Clear visual hierarchy with focus states</li>
                <li>• Mobile-first responsive design</li>
                <li>• 60% faster data visualization</li>
                <li>• Extensive personalization features</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Showcase Section Component
const FeaturesShowcaseSection = () => {
  const features = [
    {
      title: "Smart Dashboard",
      description:
        "AI-powered insights with customizable widgets and real-time data visualization for enhanced decision making.",
      image: "/ledgeriq/feature-dashboard.jpg",
      highlight: "40% faster data analysis",
    },
    {
      title: "Mobile Experience",
      description:
        "Native-quality mobile interface with offline sync capabilities and touch-optimized interactions.",
      image: "/ledgeriq/feature-mobile.jpg",
      highlight: "Perfect mobile usability score",
    },
    {
      title: "Advanced Reporting",
      description:
        "Dynamic reports with real-time collaboration features and automated insight generation.",
      image: "/ledgeriq/feature-reports.jpg",
      highlight: "300% increase in report generation",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <InView>
          <div className="mb-16 text-center">
            <ScrambleSectionTitle
              as="h2"
              className="mb-4 text-4xl font-bold text-slate-900"
            >
              Key Features & Innovation
            </ScrambleSectionTitle>
            <p className="text-xl text-slate-600">
              Exploring the design solutions that drove measurable impact
            </p>
          </div>
        </InView>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <InView key={index} delay={index * 0.1}>
              <div
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div
                  className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                    {feature.highlight}
                  </div>

                  <ScrambleSectionTitle
                    as="h3"
                    className="text-3xl font-bold text-slate-900"
                  >
                    {feature.title}
                  </ScrambleSectionTitle>

                  <p className="text-lg leading-relaxed text-slate-600">
                    {feature.description}
                  </p>

                  <Button className="group">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                  <SpotlightCard>
                    <AspectRatio
                      ratio={16 / 10}
                      className="overflow-hidden rounded-xl"
                    >
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </AspectRatio>
                  </SpotlightCard>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};

// Related Projects Section Component
const RelatedProjectsSection = ({
  relatedProjects,
}: {
  relatedProjects: Project[];
}) => {
  if (relatedProjects.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-24">
      <div className="container mx-auto px-6">
        <InView>
          <div className="mb-16 text-center">
            <ScrambleSectionTitle
              as="h2"
              className="mb-4 text-4xl font-bold text-slate-900"
            >
              Related Projects
            </ScrambleSectionTitle>
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Explore other enterprise solutions that showcase similar design
              thinking and technical excellence
            </p>
          </div>
        </InView>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {relatedProjects.map((project, index) => (
            <InView key={project.id} delay={index * 0.2}>
              <SpotlightCard className="group">
                <Card className="h-full overflow-hidden border-0 bg-white shadow-lg transition-all duration-500 hover:shadow-xl">
                  <div className="aspect-video overflow-hidden">
                    {isVimeoUrl(project.video) ? (
                      <HoverIframe
                        src={project.video}
                        title={`${project.name} Demo Video`}
                        className="h-full w-full"
                      />
                    ) : (
                      <HoverVideo
                        src={project.video}
                        poster={project.thumbnail}
                        className="h-full w-full"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <div className="mb-4">
                      <Badge
                        variant="secondary"
                        className="mb-3 bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        {project.category}
                      </Badge>
                      <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {project.name}
                      </h3>
                      <p className="mb-6 text-base leading-relaxed text-slate-600">
                        {project.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="border-slate-200 px-2 py-1 text-xs text-slate-600"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge
                            variant="outline"
                            className="border-slate-200 px-2 py-1 text-xs text-slate-600"
                          >
                            +{project.technologies.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Metrics */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          {project.metrics.slice(0, 2).map((metric, idx) => (
                            <div
                              key={idx}
                              className="rounded-lg bg-slate-50 p-3 text-center"
                            >
                              <div className="text-lg font-bold text-slate-900">
                                {metric.value}
                              </div>
                              <div className="text-xs text-slate-600">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link href={`/projects/${project.slug}`}>
                      <Button
                        className="group/btn w-full bg-slate-900 text-white hover:bg-slate-800"
                        size="lg"
                      >
                        View Project
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </SpotlightCard>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};

// Results Visualization Section Component
const ResultsSection = () => {
  const chartData = [
    { metric: "User Productivity", before: 60, after: 84 },
    { metric: "Task Completion", before: 45, after: 78 },
    { metric: "User Satisfaction", before: 62, after: 85 },
    { metric: "Processing Speed", before: 40, after: 88 },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <InView>
          <div className="mb-16 text-center">
            <ScrambleSectionTitle
              as="h2"
              className="mb-4 text-4xl font-bold text-slate-900"
            >
              Quantified Results
            </ScrambleSectionTitle>
            <p className="text-xl text-slate-600">
              Data-driven evidence of design impact and user value
            </p>
          </div>
        </InView>

        <div className="mx-auto max-w-4xl space-y-12">
          {chartData.map((item, index) => (
            <InView key={index} delay={index * 0.1}>
              <Card className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.metric}
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Improvement</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      +{item.after - item.before}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Before</span>
                    <span className="font-semibold">{item.before}%</span>
                  </div>
                  <Progress value={item.before} className="h-2 bg-red-100" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">After</span>
                    <span className="font-semibold text-emerald-600">
                      {item.after}%
                    </span>
                  </div>
                  <Progress value={item.after} className="h-2" />
                </div>
              </Card>
            </InView>
          ))}
        </div>

        {/* Call to Action */}
        <InView>
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-2xl space-y-6">
              <ScrambleSectionTitle
                as="h3"
                className="text-2xl font-bold text-slate-900"
              >
                Ready to Transform Your Product?
              </ScrambleSectionTitle>
              <p className="text-lg text-slate-600">
                Let&apos;s discuss how strategic UX design can drive measurable
                business results for your platform.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="group">
                  Start a Project
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  View More Case Studies
                </Button>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};

// Get related projects for LedgerIQ
const getRelatedProjects = (): Project[] => {
  const ledgeriqId = "ledgeriq";
  const currentProject = PROJECTS.find((p) => p.id === ledgeriqId);

  if (!currentProject) return [];

  // Filter projects that are:
  // 1. Not the current project
  // 2. Different category (to show variety)
  // 3. Have similar technologies or are enterprise-focused
  const relatedProjects = PROJECTS.filter((project) => {
    if (project.id === ledgeriqId) return false;

    // Prioritize projects with shared technologies
    const sharedTech = project.technologies.some((tech) =>
      currentProject.technologies.includes(tech),
    );

    // Or projects that are enterprise/business focused
    const isEnterprise =
      project.category === "Mobile App" ||
      project.category === "Web Application" ||
      project.description.toLowerCase().includes("enterprise") ||
      project.description.toLowerCase().includes("business") ||
      project.description.toLowerCase().includes("platform");

    return sharedTech || isEnterprise;
  });

  // Sort by relevance (shared technologies first, then by featured status)
  return relatedProjects
    .sort((a, b) => {
      const aSharedTech = a.technologies.filter((tech) =>
        currentProject.technologies.includes(tech),
      ).length;
      const bSharedTech = b.technologies.filter((tech) =>
        currentProject.technologies.includes(tech),
      ).length;

      if (aSharedTech !== bSharedTech) {
        return bSharedTech - aSharedTech;
      }

      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    })
    .slice(0, 2); // Limit to 2 related projects
};

// Main LedgerIQ Client Component
export default function LedgerIQClient() {
  const relatedProjects = getRelatedProjects();
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ImpactSection />
      <ProjectDetailsSection />
      <ProcessTimelineSection />
      <BeforeAfterSection />
      <FeaturesShowcaseSection />
      <RelatedProjectsSection relatedProjects={relatedProjects} />
      <ResultsSection />
    </main>
  );
}
