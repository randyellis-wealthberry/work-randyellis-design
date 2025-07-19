"use client";

import { motion } from "motion/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Users,
  CheckCircle,
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
import { AnimatedVideo, AnimatedImage } from "@/components/ui/animated-asset";
import { PROJECTS } from "../../data";

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
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = PROJECTS.filter(
    (p) => p.id !== project.id && p.category === project.category,
  ).slice(0, 2);

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

            <div className="aspect-video w-full">
              <AnimatedVideo
                src={project.video}
                hoverScale={1.02}
                transition={{
                  type: "spring",
                  bounce: 0.1,
                  duration: 0.4,
                }}
              />
            </div>
          </div>
        </motion.section>

        {/* Metrics */}
        {project.metrics && (
          <motion.section
            className="space-y-4"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <h2 className="text-2xl font-bold text-center">Project Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.metrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  label={metric.label}
                  value={metric.value}
                />
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
                    <AnimatedVideo
                      src={relatedProject.video}
                      hoverScale={1.05}
                      transition={{
                        type: "spring",
                        bounce: 0.1,
                        duration: 0.4,
                      }}
                    />
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
                    <Button asChild className="w-full">
                      <Link href={`/projects/${relatedProject.slug}`}>
                        View Project
                      </Link>
                    </Button>
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
          <Button asChild size="lg">
            <Link href="/#connect">Get in Touch</Link>
          </Button>
        </motion.section>
      </motion.div>
    </div>
  );
}
