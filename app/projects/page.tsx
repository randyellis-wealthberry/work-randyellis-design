"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AnimatedVideo } from "@/components/ui/animated-asset";
import { PROJECTS, PROJECT_CATEGORIES } from "../data";

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

function ProjectCard({ project }: { project: (typeof PROJECTS)[0] }) {
  return (
    <motion.div variants={VARIANTS_ITEM} transition={TRANSITION_ITEM}>
      <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="aspect-video overflow-hidden">
          <AnimatedVideo
            src={project.video}
            hoverScale={1.05}
            transition={{
              type: "spring",
              bounce: 0.1,
              duration: 0.4,
            }}
          />
        </div>

        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                {project.name}
              </CardTitle>
              <CardDescription className="text-base">
                {project.description}
              </CardDescription>
            </div>
            <Badge
              variant={
                project.status === "completed"
                  ? "default"
                  : project.status === "in-progress"
                    ? "secondary"
                    : "outline"
              }
              className="shrink-0"
            >
              {project.status === "in-progress"
                ? "In Progress"
                : project.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {project.timeline}
            </div>
            {project.teamSize && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.teamSize}{" "}
                {project.teamSize === 1 ? "person" : "people"}
              </div>
            )}
          </div>

          {project.metrics && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              {project.metrics.slice(0, 3).map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="font-semibold text-lg">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/projects/${project.slug}`}>View Details</Link>
            </Button>

            <Button asChild variant="outline" size="sm">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            {project.githubLink && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = PROJECTS.filter(
    (project) =>
      selectedCategory === "All" || project.category === selectedCategory,
  );

  const featuredProjects = PROJECTS.filter((project) => project.featured);

  return (
    <div className="min-h-screen">
      <motion.div
        className="space-y-16"
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section
          className="text-center space-y-6 py-12"
          variants={VARIANTS_ITEM}
          transition={TRANSITION_ITEM}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent">
            Selected Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of my work spanning web development, mobile applications,
            and AI-powered tools. Each project represents a unique challenge and
            opportunity to create meaningful digital experiences.
          </p>
        </motion.section>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <motion.section
            className="space-y-8"
            variants={VARIANTS_ITEM}
            transition={TRANSITION_ITEM}
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Featured Work</h2>
              <p className="text-muted-foreground">
                Highlighting some of my most impactful projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </motion.section>
        )}

        <Separator className="my-16" />

        {/* All Projects with Filtering */}
        <motion.section
          className="space-y-8"
          variants={VARIANTS_ITEM}
          transition={TRANSITION_ITEM}
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">All Projects</h2>
            <p className="text-muted-foreground">
              Browse by category or explore everything
            </p>
          </div>

          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
              {PROJECT_CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {PROJECT_CATEGORIES.map((category) => (
              <TabsContent key={category} value={category} className="mt-8">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={VARIANTS_CONTAINER}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </motion.div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12 space-y-2">
                    <h3 className="text-lg font-medium">No projects found</h3>
                    <p className="text-muted-foreground">
                      No projects match the selected category. Try a different
                      filter.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="text-center space-y-6 py-16"
          variants={VARIANTS_ITEM}
          transition={TRANSITION_ITEM}
        >
          <h2 className="text-3xl font-bold">Interested in collaborating?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I&apos;m always excited to work on new projects and explore
            innovative ideas. Let&apos;s create something amazing together.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/#connect">Get in Touch</Link>
          </Button>
        </motion.section>
      </motion.div>
    </div>
  );
}
