"use client";

import React, { useState } from "react";
import Image from "next/image";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Spotlight Card Background Effect */}
      <SpotlightCard className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      </SpotlightCard>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <TextEffect
              per="char"
              preset="fade"
              className="text-5xl lg:text-7xl font-bold text-white leading-tight"
            >
              LedgerIQ: Transforming Financial Intelligence
            </TextEffect>

            <InView>
              <div className="space-y-4">
                <p className="text-xl text-slate-300">
                  How I redesigned an enterprise financial platform to increase
                  user productivity by{" "}
                  <span className="text-emerald-400 font-bold">40%</span> and
                  reduce processing time by{" "}
                  <span className="text-emerald-400 font-bold">60%</span>
                </p>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="outline"
                    className="text-emerald-400 border-emerald-400"
                  >
                    Product Design
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-blue-400 border-blue-400"
                  >
                    UX Research
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-purple-400 border-purple-400"
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
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm" />
              <Image
                src="/ledgeriq/dashboard-overview.jpg"
                alt="LedgerIQ Dashboard Preview"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
            </AspectRatio>
          </InView>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
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
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <InView>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Measurable Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              By reimagining the user experience and streamlining complex
              financial workflows, LedgerIQ achieved significant improvements
              across all key performance indicators.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <InView key={index} delay={index * 0.1}>
              <SpotlightCard>
                <Card className="p-8 text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                    <metric.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-slate-900">
                      {metric.value}
                    </div>
                    <p className="text-slate-600 font-medium">{metric.label}</p>
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <InView>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Project Deep Dive
            </h2>
            <p className="text-xl text-slate-600">
              Explore the comprehensive design process and technical
              implementation
            </p>
          </div>
        </InView>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <InView>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    The Challenge
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
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
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        Complex multi-step workflows taking 15+ clicks
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        Inconsistent information architecture
                      </li>
                      <li className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
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
                      className="object-cover rounded-lg"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="research" className="space-y-8">
            <InView>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    User Research & Discovery
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
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
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        25+ stakeholder interviews across different roles
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Comprehensive user journey mapping
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
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
                      className="object-cover rounded-lg"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="design" className="space-y-8">
            <InView>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Design System & Interface
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
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
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Component library with 50+ reusable elements
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        High-fidelity desktop and mobile prototypes
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
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
                      className="object-cover rounded-lg"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="development" className="space-y-8">
            <InView>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Technical Implementation
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
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
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        React & TypeScript for component development
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Tailwind CSS for responsive styling
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
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
                      className="object-cover rounded-lg"
                    />
                  </AspectRatio>
                </SpotlightCard>
              </div>
            </InView>
          </TabsContent>

          <TabsContent value="results" className="space-y-8">
            <InView>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Measurable Outcomes
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
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
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        40% increase in user productivity
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        60% reduction in task completion time
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
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
                      className="object-cover rounded-lg"
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
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <InView>
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Design Process</h2>
            <p className="text-xl text-slate-300">
              A systematic approach to solving complex UX challenges
            </p>
          </div>
        </InView>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500" />

          {timelineSteps.map((step, index) => (
            <InView key={index} delay={index * 0.2}>
              <div
                className={`flex items-center mb-20 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}
                >
                  <SpotlightCard>
                    <Card className="p-8 bg-slate-800 border-slate-700">
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
                                className="text-sm text-slate-400 flex items-center gap-2"
                              >
                                <Check className="w-4 h-4 text-emerald-400" />
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
                <div className="relative z-10 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${step.color}`}
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
    <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6">
        <InView>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Transformation Results
            </h2>
            <p className="text-xl text-slate-600">
              See the dramatic improvement in user experience design
            </p>
          </div>
        </InView>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 bg-white rounded-full p-2 shadow-lg">
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
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <X className="w-5 h-5" />
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
              <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" />
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <InView>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Key Features & Innovation
            </h2>
            <p className="text-xl text-slate-600">
              Exploring the design solutions that drove measurable impact
            </p>
          </div>
        </InView>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <InView key={index} delay={index * 0.1}>
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div
                  className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    {feature.highlight}
                  </div>

                  <h3 className="text-3xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="text-lg text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <Button className="group">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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

// Results Visualization Section Component
const ResultsSection = () => {
  const chartData = [
    { metric: "User Productivity", before: 60, after: 84 },
    { metric: "Task Completion", before: 45, after: 78 },
    { metric: "User Satisfaction", before: 62, after: 85 },
    { metric: "Processing Speed", before: 40, after: 88 },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <InView>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Quantified Results
            </h2>
            <p className="text-xl text-slate-600">
              Data-driven evidence of design impact and user value
            </p>
          </div>
        </InView>

        <div className="max-w-4xl mx-auto space-y-12">
          {chartData.map((item, index) => (
            <InView key={index} delay={index * 0.1}>
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
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
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Ready to Transform Your Product?
              </h3>
              <p className="text-lg text-slate-600">
                Let&apos;s discuss how strategic UX design can drive measurable
                business results for your platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group">
                  Start a Project
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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

// Main LedgerIQ Client Component
export default function LedgerIQClient() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ImpactSection />
      <ProjectDetailsSection />
      <ProcessTimelineSection />
      <BeforeAfterSection />
      <FeaturesShowcaseSection />
      <ResultsSection />
    </main>
  );
}
