"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Users,
  CheckCircle,
  Briefcase,
  Clock,
  Target,
  Cloud,
  Cpu,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import {
  AnimatedVideo,
  AnimatedImage,
  AnimatedIframe,
} from "@/components/ui/animated-asset";
import { VideoPlayer } from "@/components/ui/video-player";
import {
  VimeoEmbed,
  isVimeoUrl,
  extractVimeoId,
} from "@/components/ui/vimeo-embed";
import { AnimatedMetricCard } from "@/components/ui/animated-metric-card";
import type { Project } from "../../data";
import { trackProjectLiveDemo, trackProjectGithub } from "@/lib/analytics";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_ITEM = {
  duration: 0.4,
};

function SectionCard({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface ProjectDetailClientProps {
  project: Project;
  relatedProjects: Project[];
}

// Helper function to determine performance level based on metric value
function getPerformanceLevel(
  value: string,
  label: string,
): "excellent" | "good" | "needs-improvement" | "neutral" {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));

  // Performance thresholds based on metric type
  if (
    label.toLowerCase().includes("success rate") ||
    label.toLowerCase().includes("usability")
  ) {
    if (value.includes("%")) {
      if (numericValue >= 90) return "excellent";
      if (numericValue >= 70) return "good";
      if (numericValue < 70) return "needs-improvement";
    } else {
      // Usability scores (typically out of 100)
      if (numericValue >= 90) return "excellent";
      if (numericValue >= 70) return "good";
      if (numericValue < 70) return "needs-improvement";
    }
  }

  // Special case for the 800% improvement - this is excellent
  if (numericValue >= 500) return "excellent";

  // Default to neutral for time-based and count metrics
  return "neutral";
}

// Helper function to group metrics
function groupMetrics(metrics: { label: string; value: string }[]) {
  const successRates = metrics.filter(
    (m) =>
      m.label.toLowerCase().includes("success rate") ||
      m.label.toLowerCase().includes("improvement") ||
      m.label.toLowerCase().includes("direct success"),
  );

  const userExperience = metrics.filter((m) =>
    m.label.toLowerCase().includes("usability"),
  );

  const researchContext = metrics.filter(
    (m) =>
      m.label.toLowerCase().includes("duration") ||
      m.label.toLowerCase().includes("participants") ||
      m.label.toLowerCase().includes("sprint") ||
      m.label.toLowerCase().includes("testing"),
  );

  return { successRates, userExperience, researchContext };
}

export default function ProjectDetailClient({
  project,
  relatedProjects,
}: ProjectDetailClientProps) {
  return (
    <div className="min-h-screen">
      <motion.div
        className="space-y-8"
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
      >
        {/* Back Navigation */}
        <motion.div variants={VARIANTS_ITEM} transition={TRANSITION_ITEM}>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.section
          className="space-y-6"
          variants={VARIANTS_ITEM}
          transition={TRANSITION_ITEM}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center flex-wrap gap-2">
                  <Badge variant="outline">{project.category}</Badge>
                  <Badge
                    variant={
                      project.status === "completed"
                        ? "default"
                        : project.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {project.status === "in-progress"
                      ? "In Progress"
                      : project.status}
                  </Badge>
                </div>

                <ScrambleSectionTitle
                  as="h1"
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                >
                  {project.name}
                </ScrambleSectionTitle>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Compact Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{project.timeline}</span>
                </div>
                {project.teamSize && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" />
                    <span>
                      {project.teamSize}{" "}
                      {project.teamSize === 1 ? "person" : "people"}
                    </span>
                  </div>
                )}
                {project.role && (
                  <div className="sm:col-span-2 text-sm font-medium text-foreground">
                    Role: {project.role}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button asChild size="sm">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackProjectLiveDemo(project.name, project.link)
                    }
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Live Project
                  </a>
                </Button>

                {project.githubLink && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackProjectGithub(project.name, project.githubLink)
                      }
                      className="flex items-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="w-full">
              {isVimeoUrl(project.video) ? (
                <VimeoEmbed
                  videoId={extractVimeoId(project.video) || ""}
                  className="aspect-video w-full"
                  title={`${project.name} Demo Video`}
                  autoplay={false}
                  loop={true}
                  muted={true}
                />
              ) : (
                <VideoPlayer
                  src={project.video}
                  poster={project.thumbnail}
                  thumbnailClassName="aspect-video w-full"
                  autoPlay={false}
                  loop={true}
                  muted={true}
                />
              )}
            </div>
          </div>
        </motion.section>

        {/* Metrics */}
        {project.metrics && (
          <motion.section
            className="space-y-8"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Measurable Impact
              </p>
              <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
                Project Results
              </ScrambleSectionTitle>
            </div>

            {(() => {
              const grouped = groupMetrics(project.metrics);
              const heroMetric = project.metrics.find(
                (m) =>
                  m.value.includes("800%") ||
                  m.label.toLowerCase().includes("direct success"),
              );

              return (
                <div className="max-w-7xl mx-auto space-y-8">
                  {/* Hero Metric */}
                  {heroMetric && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <AnimatedMetricCard
                          label={heroMetric.label}
                          value={heroMetric.value}
                          variant="hero"
                          performanceLevel={getPerformanceLevel(
                            heroMetric.value,
                            heroMetric.label,
                          )}
                          animationDelay={0}
                          springOptions={{
                            bounce: 0,
                            duration: 2500,
                          }}
                        />
                      </div>
                      <div className="lg:col-span-1 flex items-center">
                        <div className="bg-muted/30 rounded-lg p-6 w-full">
                          <h4 className="font-semibold text-lg mb-2">
                            Key Achievement
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            This represents the most significant improvement
                            achieved through the optimization of user pathways
                            and enhanced design patterns.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics Group */}
                  {grouped.successRates.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📈</span>
                        <h3 className="text-xl font-semibold">Performance</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grouped.successRates
                          .filter((metric) => !metric.value.includes("800%"))
                          .map((metric, index) => (
                            <AnimatedMetricCard
                              key={`success-${index}`}
                              label={metric.label}
                              value={metric.value}
                              performanceLevel={getPerformanceLevel(
                                metric.value,
                                metric.label,
                              )}
                              animationDelay={(index + 1) * 200}
                              springOptions={{
                                bounce: 0,
                                duration: 2000 + index * 300,
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* User Experience Group */}
                  {grouped.userExperience.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">👤</span>
                          <h3 className="text-xl font-semibold">
                            User Experience
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {grouped.userExperience.map((metric, index) => (
                            <AnimatedMetricCard
                              key={`ux-${index}`}
                              label={metric.label}
                              value={metric.value}
                              performanceLevel={getPerformanceLevel(
                                metric.value,
                                metric.label,
                              )}
                              animationDelay={
                                (grouped.successRates.length + index + 1) * 200
                              }
                              springOptions={{
                                bounce: 0,
                                duration: 2000 + index * 300,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Research Context Group */}
                  {grouped.researchContext.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🔬</span>
                          <h3 className="text-xl font-semibold">Research</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                          {grouped.researchContext.map((metric, index) => (
                            <AnimatedMetricCard
                              key={`research-${index}`}
                              label={metric.label}
                              value={metric.value}
                              performanceLevel="neutral"
                              animationDelay={
                                (grouped.successRates.length +
                                  grouped.userExperience.length +
                                  index +
                                  1) *
                                200
                              }
                              springOptions={{
                                bounce: 0,
                                duration: 2000 + index * 300,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </motion.section>
        )}

        {/* Background Story */}
        {project.processStory?.background && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                The Challenge
              </p>
              <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
                The Challenge That Started It All
              </ScrambleSectionTitle>
            </div>
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 md:p-8 border-muted hover:border-primary/30 transition-colors duration-200">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {project.processStory.background}
                </p>
              </Card>
            </div>
          </motion.section>
        )}

        <Separator />

        {/* Technologies */}
        <motion.section
          className="space-y-4"
          variants={VARIANTS_ITEM}
          transition={TRANSITION_ITEM}
        >
          <ScrambleSectionTitle as="h2" className="text-2xl font-bold">
            Technologies Used
          </ScrambleSectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="justify-center py-1.5 text-xs"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.section>

        <Separator />

        {/* Project Overview */}
        {project.overview && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Role & Team
              </p>
              <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
                Project Overview
              </ScrambleSectionTitle>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Role & Deliverables */}
              <Card className="h-full flex flex-col border-muted hover:border-primary/30 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      My Role/Deliverables
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {project.overview.deliverables.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Team & Collaboration */}
              <Card className="h-full flex flex-col border-muted hover:border-primary/30 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      Who I worked with
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {project.overview.teamMembers.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="h-full flex flex-col border-muted hover:border-primary/30 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      Timeline
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex items-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-primary">•</span>
                    <Badge
                      variant="outline"
                      className="bg-primary/5 border-primary/20 text-sm font-medium"
                    >
                      {project.overview.timelineDuration}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tools Used */}
              <Card className="h-full flex flex-col border-muted hover:border-primary/30 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      Tools Used
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {project.overview.toolsUsed.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* Approach & Methodology */}
        {(project.processStory?.approach ||
          project.processStory?.methodology) && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Strategy & Process
              </p>
              <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
                The Technical Journey
              </ScrambleSectionTitle>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              {project.processStory.approach && (
                <Card className="p-6 md:p-8 border-muted hover:border-primary/30 transition-colors duration-200">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-xl font-semibold mb-4"
                  >
                    The Vision
                  </ScrambleSectionTitle>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {project.processStory.approach}
                  </p>
                </Card>
              )}
              {project.processStory.methodology && (
                <Card className="p-6 md:p-8 border-muted hover:border-primary/30 transition-colors duration-200">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-xl font-semibold mb-4"
                  >
                    Building the Solution
                  </ScrambleSectionTitle>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {project.processStory.methodology}
                  </p>
                </Card>
              )}
            </div>
          </motion.section>
        )}

        <Separator />

        {/* Project Constraints */}
        {project.constraints && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Constraints
              </p>
              <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
                {`Constraints For The ${project.name} Project`}
              </ScrambleSectionTitle>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Environmental */}
              <Card className="h-full flex flex-col border-muted hover:border-primary/30 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Cloud className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      Environmental
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <AnimatedImage
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&crop=center"
                      alt="Environmental considerations and constraints for project development"
                      objectFit="cover"
                      hoverScale={1.02}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-3">
                      Things to consider:
                    </p>
                    <ul className="space-y-2">
                      {project.constraints.environmental?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Technical */}
              <Card className="h-full flex flex-col border-muted hover:border-primary/30 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      Technical
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <AnimatedImage
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center"
                      alt="Technical architecture and system constraints for project implementation"
                      objectFit="cover"
                      hoverScale={1.02}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-3">
                      Things to consider:
                    </p>
                    <ul className="space-y-2">
                      {project.constraints.technical?.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* Key Insights */}
        {project.processStory?.keyInsights && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                What Made This Work
              </p>
              <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
                Key Design Decisions
              </ScrambleSectionTitle>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.processStory.keyInsights.map((insight, index) => {
                  const [title, ...descriptionParts] = insight.split(": ");
                  const description = descriptionParts.join(": ");
                  return (
                    <Card
                      key={index}
                      className="p-6 border-muted hover:border-primary/30 transition-colors duration-200"
                    >
                      <ScrambleSectionTitle
                        as="h3"
                        className="text-lg font-semibold mb-3 text-primary"
                      >
                        {title}
                      </ScrambleSectionTitle>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        <Separator />

        {/* Challenges, Solutions, Learnings */}
        <motion.section
          className="space-y-6"
          variants={VARIANTS_ITEM}
          transition={TRANSITION_ITEM}
        >
          <ScrambleSectionTitle
            as="h2"
            className="text-2xl font-bold text-center"
          >
            Project Journey
          </ScrambleSectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.challenges && (
              <SectionCard
                title="Challenges"
                items={project.challenges}
                icon={Calendar}
              />
            )}

            {project.solutions && (
              <SectionCard
                title="Solutions"
                items={project.solutions}
                icon={CheckCircle}
              />
            )}

            {project.learnings && (
              <SectionCard
                title="Key Learnings"
                items={project.learnings}
                icon={Users}
              />
            )}
          </div>
        </motion.section>

        {/* Outcome & Impact */}
        {(project.processStory?.outcome ||
          project.processStory?.reflection) && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Results & Impact
              </p>
              <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
                Results That Matter
              </ScrambleSectionTitle>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              {project.processStory.outcome && (
                <Card className="p-6 md:p-8 border-muted hover:border-primary/30 transition-colors duration-200">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-xl font-semibold mb-4"
                  >
                    The Outcome
                  </ScrambleSectionTitle>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {project.processStory.outcome}
                  </p>
                </Card>
              )}

              {/* Stakeholder Quotes */}
              {project.processStory?.stakeholderQuotes && (
                <div className="space-y-4">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-xl font-semibold text-center"
                  >
                    Stakeholder Voices
                  </ScrambleSectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {project.processStory.stakeholderQuotes.map(
                      (quote, index) => (
                        <Card
                          key={index}
                          className="p-6 border-muted hover:border-primary/30 transition-colors duration-200 bg-gradient-to-br from-background to-muted/30"
                        >
                          <blockquote className="text-sm italic text-muted-foreground mb-4">
                            &ldquo;{quote.quote}&rdquo;
                          </blockquote>
                          <div className="text-xs">
                            <div className="font-semibold text-foreground">
                              {quote.author}
                            </div>
                            <div className="text-muted-foreground">
                              {quote.role}
                            </div>
                          </div>
                        </Card>
                      ),
                    )}
                  </div>
                </div>
              )}

              {project.processStory.reflection && (
                <Card className="p-6 md:p-8 border-muted hover:border-primary/30 transition-colors duration-200">
                  <ScrambleSectionTitle
                    as="h3"
                    className="text-xl font-semibold mb-4"
                  >
                    The Bigger Picture
                  </ScrambleSectionTitle>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {project.processStory.reflection}
                  </p>
                </Card>
              )}
            </div>
          </motion.section>
        )}

        <Separator />

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <ScrambleSectionTitle as="h2" className="text-2xl font-bold">
              Project Gallery
            </ScrambleSectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-video">
                  <AnimatedImage
                    src={image}
                    alt={`${project.name} screenshot ${index + 1}`}
                    objectFit="cover"
                    hoverScale={1.02}
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <ScrambleSectionTitle as="h2" className="text-2xl font-bold">
              Related Projects
            </ScrambleSectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((relatedProject) => (
                <Card
                  key={relatedProject.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden">
                    {isVimeoUrl(relatedProject.video) ? (
                      <AnimatedIframe
                        src={relatedProject.video}
                        title={`${relatedProject.name} Demo Video`}
                        hoverScale={1.05}
                      />
                    ) : (
                      <AnimatedVideo
                        src={relatedProject.video}
                        poster={relatedProject.thumbnail}
                        hoverScale={1.05}
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {relatedProject.name}
                    </CardTitle>
                    <CardDescription>
                      {relatedProject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/projects/${relatedProject.slug}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Project
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.section
          className="text-center space-y-4 py-8"
          variants={VARIANTS_ITEM}
          transition={TRANSITION_ITEM}
        >
          <ScrambleSectionTitle as="h2" className="text-3xl font-bold">
            Like what you see?
          </ScrambleSectionTitle>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I&apos;m always excited to discuss new projects and opportunities.
            Let&apos;s create something amazing together.
          </p>
          <Link
            href="/#connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </Link>
        </motion.section>
      </motion.div>
    </div>
  );
}
