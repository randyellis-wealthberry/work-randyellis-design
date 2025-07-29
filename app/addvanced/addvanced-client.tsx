"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Clock,
  Users,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Network,
  Smartphone,
  Shield,
  Award,
  Brain,
  AlertTriangle,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Custom Components
import { TextEffect } from "@/components/ui/text-effect";
import { HoverVideo } from "@/components/ui/hover-video";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import { AnimatedMetricCard } from "@/components/ui/animated-metric-card";

// Data
import { PROJECTS } from "@/app/data";

// SpotlightCard Component (reused from existing projects)
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
      className={`relative overflow-hidden rounded-xl border bg-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(200px at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 70%)`,
          opacity,
        }}
      />
      {children}
    </div>
  );
};

export default function AddvancedClient() {
  // Get the project data
  const addvancedProject = PROJECTS.find((p) => p.id === "addvanced");

  if (!addvancedProject) {
    return <div>Project not found</div>;
  }

  const {
    name,
    subtitle,
    description,
    metrics,
    challenges,
    images,
    video,
    timeline,
    role,
    overview,
    processStory,
  } = addvancedProject;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Hero Content */}
            <div className="flex flex-col justify-center space-y-8">
              {/* Context Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="w-fit text-sm">
                  <Award className="mr-2 h-4 w-4" />
                  Innovation Lab Case Study
                </Badge>
              </motion.div>

              {/* Title & Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  <TextEffect per="char" preset="fade">
                    {`${name}: Career Intelligence Platform`}
                  </TextEffect>
                </h1>
                <p className="text-xl text-muted-foreground lg:text-2xl">
                  {subtitle && `${subtitle} - `}Transforming job search from
                  reactive to strategic through AI-powered insights
                </p>
              </motion.div>

              {/* Key Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 gap-4 text-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{timeline}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Alight Solutions Innovation Lab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>{overview?.timelineDuration}</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <AnimatedMetricCard
                  label="Job Placement Success Improvement"
                  value="35%"
                  animationDelay={500}
                />
                <AnimatedMetricCard
                  label="Usability Testing Participants"
                  value="14"
                  animationDelay={700}
                />
              </motion.div>
            </div>

            {/* Hero Media */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="aspect-video overflow-hidden rounded-2xl border bg-card shadow-2xl">
                {video && (
                  <HoverVideo
                    src={video}
                    className="h-full w-full object-cover"
                    poster={images?.[1]}
                  />
                )}
              </div>

              {/* Floating Context Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 hidden lg:block"
              >
                <Card className="border-2 bg-background/80 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Innovation Lab</p>
                        <p className="text-xs text-muted-foreground">
                          1871, Chicago, IL
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Alert className="border-primary/20 bg-primary/5">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="text-base leading-relaxed">
              <strong>Innovation Lab Leadership:</strong> {description}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrambleSectionTitle className="mb-8 text-center">
            Key Achievements
          </ScrambleSectionTitle>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metrics?.slice(0, 8).map((metric, index) => (
              <AnimatedMetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Challenge Statement */}
      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <ScrambleSectionTitle className="mb-6">
                The Challenge
              </ScrambleSectionTitle>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  <strong className="text-foreground">
                    &ldquo;How might we provide an easy-to-use but powerful
                    job-hunting solution that transforms overwhelming job
                    discovery into strategic career advancement for both tech
                    and non-tech candidates?&rdquo;
                  </strong>
                </p>
                <p>
                  At Alight Solutions Innovation Lab, we faced the challenge of
                  creating a career intelligence platform that goes beyond
                  simple job tracking to provide strategic career advancement
                  tools.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Context & Constraints</h3>
              <div className="grid gap-4">
                {challenges?.slice(0, 4).map((challenge, index) => (
                  <SpotlightCard key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-destructive" />
                      <p className="text-sm">{challenge}</p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research & Discovery Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrambleSectionTitle className="mb-12 text-center">
            Research & Discovery
          </ScrambleSectionTitle>

          {/* IDI Framework */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              IDI (Innovation, Disruption, Integration) Competitive Analysis
            </h3>

            <div className="grid gap-8 md:grid-cols-3">
              <SpotlightCard className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                      <Sparkles className="h-6 w-6 text-blue-500" />
                    </div>
                    <h4 className="text-lg font-semibold">Innovation</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trello (Indirect)</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Huntr CRM (Direct)</span>
                      <Badge variant="outline">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Addvanced</span>
                      <Badge className="bg-blue-500">High</Badge>
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                      <Zap className="h-6 w-6 text-orange-500" />
                    </div>
                    <h4 className="text-lg font-semibold">Disruption</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Social Intelligence</span>
                      <Badge className="bg-orange-500">New</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time Tracking</span>
                      <Badge className="bg-orange-500">New</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network Mapping</span>
                      <Badge className="bg-orange-500">New</Badge>
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                      <Network className="h-6 w-6 text-green-500" />
                    </div>
                    <h4 className="text-lg font-semibold">Integration</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">LinkedIn API</span>
                      <Badge className="bg-green-500">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Indeed API</span>
                      <Badge className="bg-green-500">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Google OAuth</span>
                      <Badge className="bg-green-500">✓</Badge>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>

          {/* Research Methods */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold">
              Research Methodology
            </h3>

            <Tabs defaultValue="competitive" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="competitive">
                  Competitive Analysis
                </TabsTrigger>
                <TabsTrigger value="user-research">User Research</TabsTrigger>
                <TabsTrigger value="design-goals">Design Goals</TabsTrigger>
                <TabsTrigger value="insights">Key Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="competitive" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Direct Competitors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Huntr CRM</span>
                        <Badge variant="destructive">Direct</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Trello</span>
                        <Badge variant="secondary">Indirect</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Aspirational Benchmarks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Apple Notes App</span>
                        <Badge>Simplicity</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LinkedIn</span>
                        <Badge>Social Intelligence</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="user-research" className="mt-6">
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <SpotlightCard className="p-6">
                      <h4 className="mb-4 font-semibold">User Interviews</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Conducted interviews with job seekers across tech and
                        non-tech sectors to understand pain points and
                        opportunities.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            Tech sector professionals
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            Non-tech career changers
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Recent graduates</span>
                        </div>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-6">
                      <h4 className="mb-4 font-semibold">
                        Behavioral Analysis
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analyzed professional networking behaviors and career
                        advancement patterns.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            Social media usage patterns
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Network className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            Professional networking habits
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            Mobile usage preferences
                          </span>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="design-goals" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Smartphone className="mx-auto mb-4 h-8 w-8 text-primary" />
                      <h4 className="mb-2 font-semibold">Reachability</h4>
                      <p className="text-sm text-muted-foreground">
                        All functions accessible within thumb-friendly zones
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Shield className="mx-auto mb-4 h-8 w-8 text-primary" />
                      <h4 className="mb-2 font-semibold">
                        Heuristic Compliance
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Nielsen&rsquo;s usability principles implementation
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <ArrowRight className="mx-auto mb-4 h-8 w-8 text-primary" />
                      <h4 className="mb-2 font-semibold">Direct Navigation</h4>
                      <p className="text-sm text-muted-foreground">
                        Minimal steps to complete core tasks
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Target className="mx-auto mb-4 h-8 w-8 text-primary" />
                      <h4 className="mb-2 font-semibold">Purposeful Tasks</h4>
                      <p className="text-sm text-muted-foreground">
                        Every interaction serves strategic career advancement
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <div className="space-y-6">
                  {[
                    "Users needed &lsquo;always-on&rsquo; career intelligence, not just basic tracking",
                    "Social networking integration crucial for warm introductions and relationship mapping",
                    "Mobile-first approach essential for on-the-go professionals",
                    "Comparison features lacking in existing solutions (compensation, perks, timeline analysis)",
                  ].map((insight, index) => (
                    <SpotlightCard key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <p className="text-sm">{insight}</p>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Fitts Law Implementation */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Fitts Law Implementation
            </h3>
            <div className="mx-auto max-w-4xl">
              <SpotlightCard className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/projects/addvanced/addvanced-whiteboard-fitts-law.png"
                    alt="Fitts Law whiteboard implementation showing thumb-friendly interaction zones"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-center text-sm text-muted-foreground">
                    Whiteboard sketches exploring Fitts Law implementation for
                    optimal mobile interactions and thumb-friendly interaction
                    zones in the Progressive Web App design.
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* Validation & Testing Section */}
      <section className="px-6 py-16 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <ScrambleSectionTitle className="mb-12 text-center">
            Validation & Testing
          </ScrambleSectionTitle>

          {/* Testing Methodology */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Comprehensive Usability Testing Methodology
            </h3>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="mx-auto mb-4 h-8 w-8 text-primary" />
                  <h4 className="mb-2 font-semibold">14 Participants</h4>
                  <p className="text-sm text-muted-foreground">
                    Moderated usability testing in open lab environment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="mx-auto mb-4 h-8 w-8 text-primary" />
                  <h4 className="mb-2 font-semibold">4 Task Scenarios</h4>
                  <p className="text-sm text-muted-foreground">
                    Core user journeys tested via Maze platform
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Smartphone className="mx-auto mb-4 h-8 w-8 text-primary" />
                  <h4 className="mb-2 font-semibold">Cross-Platform</h4>
                  <p className="text-sm text-muted-foreground">
                    MAC/PC devices, virtual desktop/laptop sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="mx-auto mb-4 h-8 w-8 text-primary" />
                  <h4 className="mb-2 font-semibold">No Time Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Natural user behavior patterns encouraged
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Task Performance Results */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Task Performance Results
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  task: "Import Job Post",
                  success: 50,
                  usability: 74,
                  status: "needs-optimization",
                },
                {
                  task: "View Your Resume",
                  success: 64,
                  usability: 82,
                  status: "good",
                },
                {
                  task: "View Your Network",
                  success: 86,
                  usability: 93,
                  status: "excellent",
                },
                {
                  task: "View Social Activity",
                  success: 86,
                  usability: 93,
                  status: "excellent",
                },
              ].map((result, index) => (
                <SpotlightCard key={index} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{result.task}</h4>
                      <Badge
                        variant={
                          result.status === "excellent"
                            ? "default"
                            : result.status === "good"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        Task #{index + 1}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Success Rate
                          </span>
                          <span className="text-sm font-bold">
                            {result.success}%
                          </span>
                        </div>
                        <Progress value={result.success} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Usability Score
                          </span>
                          <span className="text-sm font-bold">
                            {result.usability}
                          </span>
                        </div>
                        <Progress value={result.usability} className="h-2" />
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Critical Findings */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Critical Findings & Optimizations
            </h3>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Optimization Needed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-sm">
                        50% of testers deviated from expected path for Job
                        Import
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-sm">
                        7 testers became completely lost during Task #1
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-sm">
                        60% mission unfinished rate for problematic flows
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Success Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">
                        800% higher success rate for optimized paths
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">
                        86%+ success rate for networking features
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">
                        93+ usability scores for social intelligence
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Heatmap Analysis */}
          <div>
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Heatmap Analysis & User Behavior
            </h3>
            <div className="mx-auto max-w-4xl">
              <Alert>
                <BarChart3 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Visual Tracking Results:</strong> Heatmap analysis
                  revealed user attention patterns and pain points, identifying
                  critical areas where users got confused or lost. This data
                  informed design iterations for improved navigation flow and
                  contributed to the 800% success rate improvement for optimized
                  user paths.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Outcomes Section */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrambleSectionTitle className="mb-12 text-center">
            Impact & Outcomes
          </ScrambleSectionTitle>

          {/* Business Impact */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Business Impact
            </h3>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <SpotlightCard className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h4 className="mb-2 text-3xl font-bold">35%</h4>
                <p className="text-sm text-muted-foreground">
                  Improvement in customer job placement success - primary
                  success metric
                </p>
              </SpotlightCard>

              <SpotlightCard className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-bold">B2C Market</h4>
                <p className="text-sm text-muted-foreground">
                  Validated market opportunity beyond enterprise focus
                </p>
              </SpotlightCard>

              <SpotlightCard className="p-6 text-center">
                <div className="mb-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <Network className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-bold">White-Label</h4>
                <p className="text-sm text-muted-foreground">
                  Foundation for B2B product offerings and scalability
                </p>
              </SpotlightCard>
            </div>
          </div>

          {/* Design Impact */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Design Impact & Innovation
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Career Intelligence Paradigm",
                  description:
                    "Established new paradigm for career intelligence vs. simple job tracking",
                  icon: Brain,
                },
                {
                  title: "Social Networking Integration",
                  description:
                    "Integrated social networking as core career advancement tool",
                  icon: Network,
                },
                {
                  title: "Mobile-First Validation",
                  description:
                    "Validated mobile-first approach for professional applications",
                  icon: Smartphone,
                },
                {
                  title: "Accessibility Standards",
                  description:
                    "Set Level AA compliance standards for enterprise career tools",
                  icon: Shield,
                },
              ].map((impact, index) => (
                <SpotlightCard key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <impact.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">{impact.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {impact.description}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Stakeholder Quotes */}
          <div>
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Stakeholder Feedback
            </h3>

            <div className="grid gap-8 lg:grid-cols-3">
              {processStory?.stakeholderQuotes?.map((quote, index) => (
                <SpotlightCard key={index} className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm italic">
                      &ldquo;{quote.quote}&rdquo;
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{quote.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {quote.role}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reflection & Learnings Section */}
      <section className="px-6 py-16 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <ScrambleSectionTitle className="mb-12 text-center">
            Reflection & Learnings
          </ScrambleSectionTitle>

          {/* Innovation Lab Context */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Innovation Lab Leadership Context
            </h3>

            <div className="mx-auto max-w-4xl">
              <SpotlightCard className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Alight Solutions Innovation Lab
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        1871, Chicago, IL
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3 text-center">
                    <div>
                      <h5 className="font-semibold mb-2">Lab Mission</h5>
                      <p className="text-sm text-muted-foreground">
                        Tip of the spear for B2C/B2B digital product creation
                        using lean startup and UX methodologies
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Approach</h5>
                      <p className="text-sm text-muted-foreground">
                        Fast movers - collect data, synthesize, and take action
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Team Structure</h5>
                      <p className="text-sm text-muted-foreground">
                        Cross-functional collaboration with daily standups and
                        rapid iteration cycles
                      </p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Strategic Design Leadership Learnings
            </h3>

            <div className="grid gap-8 lg:grid-cols-2">
              {processStory?.keyInsights?.map((insight, index) => (
                <SpotlightCard key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed">{insight}</p>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Technical Tools & Methods */}
          <div className="mb-16">
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Innovation Lab Tools & Methods
            </h3>

            <Tabs defaultValue="prototyping" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="prototyping">Prototyping</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
                <TabsTrigger value="analog">Analog Methods</TabsTrigger>
              </TabsList>

              <TabsContent value="prototyping" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                        <Smartphone className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">
                          InVision - High-Fidelity Prototyping
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Direct-to-high-fidelity approach enabling rapid
                          stakeholder validation and user testing without
                          traditional wireframing phases.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Interactive mobile-first prototypes
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              OAuth integration mockups
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Social intelligence feature demos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaboration" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                        <Network className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">
                          Miro - Wireframing & Collaboration
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Facilitated cross-functional team ideation sessions
                          and information architecture planning in real-time
                          collaborative environment.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">User flow mapping</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              IDI framework visualization
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Cross-functional brainstorming
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testing" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                        <BarChart3 className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">
                          Maze - Unmoderated Usability Testing
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Comprehensive testing platform enabling detailed
                          analytics on user behavior patterns and task
                          completion rates across 4 core scenarios.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              14-participant usability study
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Heatmap analysis and user paths
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Success rate optimization
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analog" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                        <Zap className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">
                          Whiteboard & Sharpie - Initial Conceptualization
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Rapid ideation and Fitts Law exploration sessions
                          using traditional analog methods for immediate team
                          alignment and concept validation.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Fitts Law interaction zones
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Mobile interface sketching
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              Team alignment sessions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Final Reflection */}
          <div>
            <h3 className="mb-8 text-2xl font-semibold text-center">
              Design Leadership Reflection
            </h3>

            <div className="mx-auto max-w-4xl">
              <SpotlightCard className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold mb-4">
                      Innovation Lab Impact
                    </h4>
                  </div>

                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {processStory?.reflection}
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3 pt-6 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        35%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Job Placement Improvement
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        2 weeks
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sprint Duration
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        800%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Optimized Path Success
                      </p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action / Next Steps */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-4 text-2xl font-semibold">
            Ready to Drive Innovation?
          </h3>
          <p className="mb-8 text-lg text-muted-foreground">
            This case study demonstrates strategic UX leadership in
            high-velocity innovation environments. Let&rsquo;s discuss how this
            experience can drive results for your next product challenge.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/#contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">View More Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
