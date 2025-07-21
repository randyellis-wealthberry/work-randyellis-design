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
  MapPin,
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
import type { Project } from "../../data";

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
  ease: "easeOut",
};

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/30 bg-gradient-to-br from-background to-muted/30">
      <CardContent className="pt-6 text-center">
        <div className="text-2xl md:text-3xl font-bold text-primary mb-2 min-h-[2.5rem] flex items-center justify-center">
          {value}
        </div>
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
      </CardContent>
    </Card>
  );
}

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
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">{item}</span>
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

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {project.name}
                </h1>

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
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Measurable Impact
              </p>
              <h2 className="text-3xl font-bold">Project Results</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center max-w-4xl mx-auto">
              {project.metrics.map((metric, index) => (
                <div key={index} className="w-full max-w-sm">
                  <MetricCard label={metric.label} value={metric.value} />
                </div>
              ))}
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
          <h2 className="text-2xl font-bold">Technologies Used</h2>
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
              <h2 className="text-3xl font-bold">Project Overview</h2>
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
              <h2 className="text-3xl font-bold">
                Constraints For The GrowIt App
              </h2>
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
                      src="/projects/growit/scene-mockup.jpg"
                      alt="GrowIt app in natural garden environment showing environmental considerations"
                      objectFit="cover"
                      hoverScale={1.02}
                      transition={{
                        type: "spring",
                        bounce: 0.1,
                        duration: 0.3,
                      }}
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
                      src="/projects/growit/technical-concepts.png"
                      alt="GrowIt technical architecture and beacon signal concepts"
                      objectFit="cover"
                      hoverScale={1.02}
                      transition={{
                        type: "spring",
                        bounce: 0.1,
                        duration: 0.3,
                      }}
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

              {/* Location - Spans full width on large screens */}
              <Card className="lg:col-span-2 h-full flex flex-col border-muted hover:border-primary/30 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      Location
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <AnimatedImage
                        src="/projects/growit/location-features.png"
                        alt="GrowIt location-based features and community mapping"
                        objectFit="cover"
                        hoverScale={1.02}
                        transition={{
                          type: "spring",
                          bounce: 0.1,
                          duration: 0.3,
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-3">
                        Things to consider:
                      </p>
                      <ul className="space-y-2">
                        {project.constraints.location?.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span className="text-sm text-muted-foreground leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          <h2 className="text-2xl font-bold text-center">Project Journey</h2>
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

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <motion.section
            className="space-y-6"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <h2 className="text-2xl font-bold">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="aspect-video">
                  <AnimatedImage
                    src={image}
                    alt={`${project.name} screenshot ${index + 1}`}
                    objectFit="cover"
                    hoverScale={1.02}
                    transition={{
                      type: "spring",
                      bounce: 0.1,
                      duration: 0.3,
                    }}
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
            <h2 className="text-2xl font-bold">Related Projects</h2>
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
                        transition={{
                          type: "spring",
                          bounce: 0.1,
                          duration: 0.4,
                        }}
                      />
                    ) : (
                      <AnimatedVideo
                        src={relatedProject.video}
                        poster={relatedProject.thumbnail}
                        hoverScale={1.05}
                        transition={{
                          type: "spring",
                          bounce: 0.1,
                          duration: 0.4,
                        }}
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
          <h2 className="text-3xl font-bold">Like what you see?</h2>
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
