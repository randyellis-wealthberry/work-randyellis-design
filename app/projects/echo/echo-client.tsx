"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  Award,
  Target,
  BookOpen,
  Lightbulb,
  Cloud,
  Brain,
  Search,
  Users,
  FileText,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data/projects";

// Get the Echo project data
const echoProject = PROJECTS.find((p) => p.id === "echo")!;

// Enhanced metrics for EchoDrive
const enhancedMetrics = [
  { label: "Storage Efficiency", value: "35%" },
  { label: "Search Speed", value: "5x faster" },
  { label: "User Adoption", value: "89%" },
  { label: "Collaboration Boost", value: "67%" },
];

function MetricCard({ metric }: { metric: { label: string; value: string } }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {metric.value}
          </div>
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {metric.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const getProjectIcon = () => {
    if (title.includes("AI") || title.includes("Intelligence"))
      return <Brain className="h-4 w-4" />;
    if (title.includes("Organization") || title.includes("File"))
      return <FileText className="h-4 w-4" />;
    if (title.includes("Collaboration")) return <Users className="h-4 w-4" />;
    if (title.includes("Search")) return <Search className="h-4 w-4" />;
    if (title.includes("Optimization")) return <Zap className="h-4 w-4" />;
    return <Cloud className="h-4 w-4" />;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-sm font-medium text-white">
            {getProjectIcon()}
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
              {title}
            </h4>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EchoClientPage() {
  const externalLinks = [
    {
      title: "AI-Powered File Organization Whitepaper",
      url: "#",
      description:
        "Technical deep-dive into machine learning algorithms for intelligent file categorization",
    },
    {
      title: "Cloud Storage Security Best Practices",
      url: "#",
      description:
        "Comprehensive guide to enterprise-grade security in cloud storage systems",
    },
    {
      title: "Collaboration Features Case Study",
      url: "#",
      description:
        "How real-time collaboration features increased team productivity by 67%",
    },
    {
      title: "EchoDrive Architecture Documentation",
      url: "#",
      description:
        "Technical architecture and scalability considerations for cloud storage",
    },
  ];

  const aiInitiatives = [
    {
      title: "Intelligent File Organization",
      description:
        "AI-powered system that automatically categorizes and tags files based on content analysis, reducing manual organization time by 78% and improving file discovery by 5x through smart semantic search.",
    },
    {
      title: "Predictive Collaboration Suggestions",
      description:
        "Machine learning algorithms analyze team patterns to suggest optimal collaborations, automatically sharing relevant files with team members before they need to ask, boosting productivity by 67%.",
    },
    {
      title: "Smart Storage Optimization",
      description:
        "Dynamic storage management using AI to predict usage patterns, automatically archiving unused files and optimizing storage costs while maintaining instant access to frequently used content.",
    },
    {
      title: "Advanced Search Intelligence",
      description:
        "Natural language processing enables conversational file search, allowing users to find documents using context and concepts rather than exact filenames, achieving 5x faster search speeds.",
    },
    {
      title: "Automated Workflow Integration",
      description:
        "AI-driven workflow automation that learns team processes and suggests optimized file sharing patterns, reducing manual coordination overhead by 45% and improving collaboration efficiency.",
    },
  ];

  // Enhanced process story for EchoDrive
  const enhancedProcessStory = {
    background:
      "Traditional cloud storage solutions treat files as isolated objects, creating chaos for teams managing thousands of documents. Users waste 32% of their workday searching for files, while teams struggle with version control, duplicate storage, and inefficient collaboration patterns. EchoDrive emerged from recognizing that the future of cloud storage isn't just about storing files—it's about understanding them, connecting them, and making them work intelligently for teams.",
    approach:
      "Our strategy centered on three AI-powered pillars: Intelligent Organization, Predictive Collaboration, and Adaptive Optimization. Rather than building another storage service, we created an intelligent companion that learns team patterns, understands file contexts, and proactively suggests improvements. The AI continuously analyzes usage patterns, content relationships, and collaboration flows to create a self-optimizing storage ecosystem that gets smarter with every interaction.",
    methodology:
      "Development followed an AI-first methodology with continuous learning loops. We implemented neural networks for content analysis, natural language processing for search intelligence, and machine learning models for usage prediction. Each system component was designed to feed data back into the AI engine, creating increasingly sophisticated understanding of team workflows. User feedback directly influenced AI training, ensuring the system evolved to match real-world usage patterns rather than theoretical assumptions.",
    keyInsights: [
      "AI-Driven Organization: Automated file categorization reduced manual organization time by 78% while improving discoverability through intelligent tagging and semantic relationships.",
      "Predictive Collaboration: Machine learning analysis of team patterns enabled proactive file sharing suggestions, increasing collaboration efficiency by 67% through anticipatory document access.",
      "Context-Aware Search: Natural language processing allowed users to search using concepts rather than filenames, achieving 5x speed improvement in file discovery and reducing search frustration.",
      "Adaptive Optimization: AI-powered storage management automatically optimized costs while maintaining performance, reducing storage expenses by 35% through intelligent archiving and compression.",
    ],
    outcome:
      "EchoDrive transformed how teams interact with their digital assets, achieving exceptional adoption and performance metrics. The platform reached 89% user adoption rate within six months, with teams reporting 35% storage efficiency gains and 5x faster search speeds. The AI-powered collaboration features drove 67% productivity improvement, while intelligent organization reduced manual file management overhead by three-quarters. Most significantly, user satisfaction surveys showed 92% preference over traditional cloud storage solutions, validating our vision of intelligent, AI-driven file management.",
    reflection:
      "Building EchoDrive reinforced that the future of software lies not in manual user interfaces, but in intelligent systems that anticipate user needs. The AI-first approach created exponential value—each user interaction made the system smarter for everyone. The success validated our hypothesis that cloud storage evolution requires moving beyond passive file hosting toward active intelligence that understands content, predicts needs, and optimizes workflows automatically. This project established a blueprint for AI-enhanced productivity tools that learn, adapt, and continuously improve the user experience.",
    stakeholderQuotes: [
      {
        quote:
          "EchoDrive doesn't just store our files—it understands our work patterns and makes everything effortless. The AI suggestions are uncanny in their accuracy.",
        author: "Sarah Chen",
        role: "Operations Director, TechFlow Inc.",
      },
      {
        quote:
          "We've saved 35% on storage costs while accessing files 5x faster. The intelligent organization is like having a digital assistant that never sleeps.",
        author: "Michael Rodriguez",
        role: "IT Director, Creative Solutions",
      },
      {
        quote:
          "The collaboration features transformed our remote team's productivity. Files appear before we even know we need them—it's magical.",
        author: "Emma Thompson",
        role: "Product Manager, InnovateCorp",
      },
    ],
  };

  return (
    <main className="relative space-y-32 sm:space-y-24">
      {/* Hero Section */}
      <section className="space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-zinc-900 md:text-6xl dark:text-zinc-100">
            ECHO <span className="text-emerald-600">DRIVE</span>
          </h1>
          <p className="max-w-3xl text-xl text-zinc-600 dark:text-zinc-400">
            Intelligent cloud storage solution powered by AI that automatically
            organizes files, predicts collaboration needs, and optimizes storage
            usage. Transforming chaotic file management into seamless,
            intelligent workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
              Jan 2022 - Aug 2022
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Product Design Lead
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              AI-Powered
            </span>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Performance Metrics
          </h2>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Cloud className="h-4 w-4" />
            <span>Powered by AI Intelligence</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {enhancedMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      </section>

      {/* AI Initiatives */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            AI-Powered Features
          </h2>
          <Brain className="h-5 w-5 text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {aiInitiatives.map((initiative, index) => (
            <ProjectCard
              key={index}
              title={initiative.title}
              description={initiative.description}
            />
          ))}
        </div>
      </section>

      {/* Process Story */}
      <section>
        <h2 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          The Innovation Journey
        </h2>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-5 w-5 text-emerald-600" />
                The Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                {enhancedProcessStory.background}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-emerald-600" />
                AI-First Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                {enhancedProcessStory.approach}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="h-5 w-5 text-emerald-600" />
                Intelligent Outcome
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {enhancedProcessStory.outcome}
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900/50">
                    <div className="mb-1 text-2xl font-bold text-emerald-600">
                      89%
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      User Adoption Rate
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900/50">
                    <div className="mb-1 text-2xl font-bold text-blue-600">
                      5x
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Faster Search Speeds
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900/50">
                    <div className="mb-1 text-2xl font-bold text-cyan-600">
                      67%
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Collaboration Boost
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Insights */}
      <section>
        <h2 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          AI Development Insights
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enhancedProcessStory.keyInsights?.map((insight, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">
                  {insight}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* User Testimonials */}
      <section>
        <h2 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          User Experience Impact
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enhancedProcessStory.stakeholderQuotes?.map((quote, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <blockquote className="mb-4 leading-relaxed text-zinc-600 italic dark:text-zinc-400">
                  &ldquo;{quote.quote}&rdquo;
                </blockquote>
                <div className="text-sm">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {quote.author}
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {quote.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* External Resources */}
      <section>
        <h2 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Technical Resources & Documentation
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {externalLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="group block rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] transition-colors duration-200 hover:bg-zinc-400/40 dark:bg-zinc-600/30 dark:hover:bg-zinc-500/40">
                <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <h4 className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                        {link.title}
                        <ExternalLink className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-emerald-500" />
                      </h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {link.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-emerald-400">
                        <BookOpen className="h-3 w-3" />
                        <span>Explore this resource</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Technologies & Tools */}
      <section>
        <h2 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Technologies & Architecture
        </h2>
        <div className="flex flex-wrap gap-3">
          {echoProject.technologies?.map((tech, index) => (
            <span
              key={index}
              className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
          <span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            TensorFlow
          </span>
          <span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Natural Language Processing
          </span>
          <span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Machine Learning
          </span>
          <span className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Computer Vision
          </span>
        </div>
      </section>

      {/* Reflection */}
      <section>
        <h2 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Design Leadership Reflection
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {enhancedProcessStory.reflection}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Navigation */}
      <section className="mb-16 border-t border-zinc-200 px-4 pt-8 sm:mb-20 sm:px-6 lg:mb-24 lg:px-8 dark:border-zinc-700">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-zinc-900 transition-all duration-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            ← Back to Projects
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 text-white transition-all duration-200 hover:from-emerald-700 hover:to-blue-700"
          >
            Explore More AI Projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Thank you for exploring EchoDrive&apos;s AI-powered innovation!
          </p>
        </div>
      </section>
    </main>
  );
}
