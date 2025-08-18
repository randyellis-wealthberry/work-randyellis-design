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
import { HoverVideo } from "@/components/ui/hover-video";
import { AnimatedMetricCard } from "@/components/ui/animated-metric-card";

// Data
import { PROJECTS } from "@/lib/data/projects";

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
      className={`bg-card relative overflow-hidden rounded-xl border ${className}`}
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
    // name,
    // subtitle,
    description,
    metrics,
    challenges,
    images,
    video,
    // timeline,
    // role,
    // overview,
    processStory,
  } = addvancedProject;

  return (
    <main className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
      {/* Hero Section - Professional Redesign */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <Badge variant="outline" className="mb-4 text-xs">
              <Award className="mr-1.5 h-3 w-3" />
              Innovation Lab Case Study
            </Badge>
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              AI-Enhanced Career Intelligence Platform
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              Transforming job search from reactive to strategic through
              AI-powered insights
            </p>
          </motion.div>

          {/* Professional Metadata Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="bg-muted/30 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-lg border px-6 py-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground h-3.5 w-3.5" />
                <span className="font-medium">
                  Product Design Director & Strategic UX Lead
                </span>
              </div>
              <div className="bg-border hidden h-4 w-px sm:block" />
              <div className="flex items-center gap-2">
                <Target className="text-muted-foreground h-3.5 w-3.5" />
                <span>Alight Solutions Innovation Lab</span>
              </div>
              <div className="bg-border hidden h-4 w-px sm:block" />
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-3.5 w-3.5" />
                <span>2 weeks (Sprint)</span>
              </div>
              <div className="bg-border hidden h-4 w-px sm:block" />
              <div className="flex items-center gap-2">
                <Brain className="text-muted-foreground h-3.5 w-3.5" />
                <span>1871, Chicago, IL</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Media - Full Width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <div className="bg-card aspect-[16/9] overflow-hidden rounded-xl border shadow-xl">
              {video && (
                <HoverVideo
                  src={video}
                  className="h-full w-full object-cover"
                  poster={images?.[1]}
                />
              )}
            </div>
          </motion.div>

          {/* Professional Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Success Metric */}
              <div className="bg-card flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-primary text-2xl font-bold">35%</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Job Placement Success
                  </div>
                  <div className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                    ↑ Improvement
                  </div>
                </div>
                <TrendingUp className="text-muted-foreground/20 h-8 w-8" />
              </div>

              {/* Testing Metric */}
              <div className="bg-card flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-primary text-2xl font-bold">14</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Usability Testing
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    Participants
                  </div>
                </div>
                <Users className="text-muted-foreground/20 h-8 w-8" />
              </div>

              {/* Sprint Metric */}
              <div className="bg-card flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-primary text-2xl font-bold">2</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Week Sprint
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    Rapid Delivery
                  </div>
                </div>
                <Zap className="text-muted-foreground/20 h-8 w-8" />
              </div>
            </div>
          </motion.div>
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
          <h3 className="mb-8 text-center text-2xl font-semibold">
            Key Achievements
          </h3>

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
              <h3 className="mb-6 text-2xl font-semibold">The Challenge</h3>
              <div className="text-muted-foreground space-y-4 text-lg">
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
                      <div className="bg-destructive mt-1 h-2 w-2 rounded-full" />
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
          <h3 className="mb-12 text-center text-2xl font-semibold">
            Research & Discovery
          </h3>

          {/* IDI Framework */}
          <div className="mb-16">
            <h3 className="mb-8 text-center text-2xl font-semibold">
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
                      <p className="text-muted-foreground mb-4 text-sm">
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
                      <p className="text-muted-foreground mb-4 text-sm">
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
                      <Smartphone className="text-primary mx-auto mb-4 h-8 w-8" />
                      <h4 className="mb-2 font-semibold">Reachability</h4>
                      <p className="text-muted-foreground text-sm">
                        All functions accessible within thumb-friendly zones
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Shield className="text-primary mx-auto mb-4 h-8 w-8" />
                      <h4 className="mb-2 font-semibold">
                        Heuristic Compliance
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Nielsen&rsquo;s usability principles implementation
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <ArrowRight className="text-primary mx-auto mb-4 h-8 w-8" />
                      <h4 className="mb-2 font-semibold">Direct Navigation</h4>
                      <p className="text-muted-foreground text-sm">
                        Minimal steps to complete core tasks
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Target className="text-primary mx-auto mb-4 h-8 w-8" />
                      <h4 className="mb-2 font-semibold">Purposeful Tasks</h4>
                      <p className="text-muted-foreground text-sm">
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
                        <div className="bg-primary/10 text-primary mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
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
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Fitts Law Implementation
            </h3>
            <div className="mx-auto max-w-4xl">
              <SpotlightCard className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src="/projects/addvanced/addvanced-whiteboard-fitts-law.png"
                    alt="Fitts Law whiteboard implementation showing thumb-friendly interaction zones"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground text-center text-sm">
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
      <section className="bg-muted/30 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-12 text-center text-2xl font-semibold">
            Validation & Testing
          </h3>

          {/* Testing Methodology */}
          <div className="mb-16">
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Comprehensive Usability Testing Methodology
            </h3>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="text-primary mx-auto mb-4 h-8 w-8" />
                  <h4 className="mb-2 font-semibold">14 Participants</h4>
                  <p className="text-muted-foreground text-sm">
                    Moderated usability testing in open lab environment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="text-primary mx-auto mb-4 h-8 w-8" />
                  <h4 className="mb-2 font-semibold">4 Task Scenarios</h4>
                  <p className="text-muted-foreground text-sm">
                    Core user journeys tested via Maze platform
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Smartphone className="text-primary mx-auto mb-4 h-8 w-8" />
                  <h4 className="mb-2 font-semibold">Cross-Platform</h4>
                  <p className="text-muted-foreground text-sm">
                    MAC/PC devices, virtual desktop/laptop sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="text-primary mx-auto mb-4 h-8 w-8" />
                  <h4 className="mb-2 font-semibold">No Time Limits</h4>
                  <p className="text-muted-foreground text-sm">
                    Natural user behavior patterns encouraged
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Task Performance Results */}
          <div className="mb-16">
            <h3 className="mb-8 text-center text-2xl font-semibold">
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
                        <div className="mb-2 flex items-center justify-between">
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
                        <div className="mb-2 flex items-center justify-between">
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
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Critical Findings & Optimizations
            </h3>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Optimization Needed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-destructive h-2 w-2 rounded-full" />
                      <span className="text-sm">
                        50% of testers deviated from expected path for Job
                        Import
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-destructive h-2 w-2 rounded-full" />
                      <span className="text-sm">
                        7 testers became completely lost during Task #1
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-destructive h-2 w-2 rounded-full" />
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
            <h3 className="mb-8 text-center text-2xl font-semibold">
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
          <h3 className="mb-12 text-center text-2xl font-semibold">
            Impact & Outcomes
          </h3>

          {/* Business Impact */}
          <div className="mb-16">
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Business Impact
            </h3>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <SpotlightCard className="p-6 text-center">
                <div className="mb-4">
                  <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                    <TrendingUp className="text-primary h-8 w-8" />
                  </div>
                </div>
                <h4 className="mb-2 text-3xl font-bold">35%</h4>
                <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground text-sm">
                  Foundation for B2B product offerings and scalability
                </p>
              </SpotlightCard>
            </div>
          </div>

          {/* Design Impact */}
          <div className="mb-16">
            <h3 className="mb-8 text-center text-2xl font-semibold">
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
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                      <impact.icon className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold">{impact.title}</h4>
                      <p className="text-muted-foreground text-sm">
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
            <h3 className="mb-8 text-center text-2xl font-semibold">
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
                      <p className="text-muted-foreground text-sm">
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
      <section className="bg-muted/30 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-12 text-center text-2xl font-semibold">
            Reflection & Learnings
          </h3>

          {/* Innovation Lab Context */}
          <div className="mb-16">
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Innovation Lab Leadership Context
            </h3>

            <div className="mx-auto max-w-4xl">
              <SpotlightCard className="p-8">
                <div className="space-y-6 text-center">
                  <div className="mb-6 flex items-center justify-center gap-3">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                      <Brain className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Alight Solutions Innovation Lab
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        1871, Chicago, IL
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 text-center md:grid-cols-3">
                    <div>
                      <h5 className="mb-2 font-semibold">Lab Mission</h5>
                      <p className="text-muted-foreground text-sm">
                        Tip of the spear for B2C/B2B digital product creation
                        using lean startup and UX methodologies
                      </p>
                    </div>
                    <div>
                      <h5 className="mb-2 font-semibold">Approach</h5>
                      <p className="text-muted-foreground text-sm">
                        Fast movers - collect data, synthesize, and take action
                      </p>
                    </div>
                    <div>
                      <h5 className="mb-2 font-semibold">Team Structure</h5>
                      <p className="text-muted-foreground text-sm">
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
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Strategic Design Leadership Learnings
            </h3>

            <div className="grid gap-8 lg:grid-cols-2">
              {processStory?.keyInsights?.map((insight, index) => (
                <SpotlightCard key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
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
            <h3 className="mb-8 text-center text-2xl font-semibold">
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
                        <p className="text-muted-foreground mb-4 text-sm">
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
                        <p className="text-muted-foreground mb-4 text-sm">
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
                        <p className="text-muted-foreground mb-4 text-sm">
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
                        <p className="text-muted-foreground mb-4 text-sm">
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
            <h3 className="mb-8 text-center text-2xl font-semibold">
              Design Leadership Reflection
            </h3>

            <div className="mx-auto max-w-4xl">
              <SpotlightCard className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <Award className="text-primary h-8 w-8" />
                    </div>
                    <h4 className="mb-4 text-xl font-semibold">
                      Innovation Lab Impact
                    </h4>
                  </div>

                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {processStory?.reflection}
                    </p>
                  </div>

                  <div className="grid gap-6 border-t pt-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-primary mb-2 text-2xl font-bold">
                        35%
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Job Placement Improvement
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-primary mb-2 text-2xl font-bold">
                        2 weeks
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Sprint Duration
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-primary mb-2 text-2xl font-bold">
                        800%
                      </div>
                      <p className="text-muted-foreground text-sm">
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
          <p className="text-muted-foreground mb-8 text-lg">
            This case study demonstrates strategic UX leadership in
            high-velocity innovation environments. Let&rsquo;s discuss how this
            experience can drive results for your next product challenge.
          </p>
          <div className="flex justify-center gap-4">
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
