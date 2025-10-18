"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  Award,
  Target,
  BookOpen,
  Lightbulb,
  Truck,
  Smartphone,
  MapPin,
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
  { label: "Active Drivers", value: "10,000+" },
  { label: "Revenue Increase", value: "16%" },
  { label: "Shipment Growth", value: "12%" },
  { label: "ELD Compliance", value: "100%" },
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
    if (title.includes("ELD") || title.includes("Compliance"))
      return <FileText className="h-4 w-4" />;
    if (title.includes("Mobile") || title.includes("Driver"))
      return <Smartphone className="h-4 w-4" />;
    if (title.includes("Tracking") || title.includes("GPS"))
      return <MapPin className="h-4 w-4" />;
    if (title.includes("Communication")) return <Users className="h-4 w-4" />;
    if (title.includes("Revenue") || title.includes("Growth"))
      return <Zap className="h-4 w-4" />;
    return <Truck className="h-4 w-4" />;
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
      title: "ELD Mandate Compliance Guide",
      url: "#",
      description:
        "Complete guide to Electronic Logging Device requirements and implementation strategies",
    },
    {
      title: "Mobile Driver Experience Best Practices",
      url: "#",
      description:
        "Comprehensive guide to designing mobile applications for trucking industry professionals",
    },
    {
      title: "Logistics Technology Integration Case Study",
      url: "#",
      description:
        "How digital transformation increased LTL shipment revenues by 16% and reduced call center stress",
    },
    {
      title: "EchoDrive Fleet Management Documentation",
      url: "#",
      description:
        "Technical architecture and scalability considerations for logistics management platforms",
    },
  ];

  const logisticsFeatures = [
    {
      title: "ELD Mandate Compliance",
      description:
        "Electronic logging system that automatically tracks driving hours and ensures compliance with federal regulations, eliminating manual logging processes and reducing compliance violations by 100%.",
    },
    {
      title: "Real-time Shipment Tracking",
      description:
        "GPS-enabled tracking system providing live location updates and delivery status notifications, improving truckload visibility and reducing call-center stress by automating status inquiries.",
    },
    {
      title: "Mobile Driver Communication",
      description:
        "In-app messaging platform connecting drivers with dispatch teams, enabling instant issue reporting, job sharing, and seamless coordination across the entire logistics network.",
    },
    {
      title: "Interactive Driver Onboarding",
      description:
        "Comprehensive tutorial system with step-by-step guidance for new drivers, reducing training time and ensuring consistent adoption of digital tools across diverse driver demographics.",
    },
    {
      title: "Self-serve LTL Booking",
      description:
        "Streamlined Less Than Truckload shipment booking application that increased LTL revenues by 16% and grew shipment volume by 12% through automated pricing and scheduling.",
    },
  ];

  // Enhanced process story for EchoDrive
  const enhancedProcessStory = {
    background:
      "The shipping industry relied on outdated coordination methods, creating communication gaps between shippers, drivers, and dispatch teams. Echo Global Logistics, with over 30 offices nationwide and 40,000+ transportation providers, struggled with operational inefficiencies, compliance challenges with new ELD regulations, and limited shipment visibility. The traditional approaches were causing stress on call centers, manual process errors, and missed opportunities for revenue growth in the competitive logistics market.",
    approach:
      "Our strategy centered on comprehensive field research and dual-platform development. Rather than building another generic logistics tool, we created a driver-focused solution through extensive on-site research with drivers and dispatch teams. The approach emphasized understanding real-world workflows, from truck cabs to dispatch offices, and building mobile applications that accommodate the unique working conditions of the trucking industry while integrating seamlessly with existing Echo systems.",
    methodology:
      "Development followed a research-driven methodology with stakeholder engagement at every phase. We conducted in-depth interviews with drivers and dispatch officers in their natural work environments, mapped comprehensive user journeys, and created detailed workflows that highlighted critical touchpoints and pain points. The dual-platform strategy ensured native mobile applications for drivers worked in harmony with web applications for dispatch teams, creating consistent experiences across all user groups while addressing their specific needs.",
    keyInsights: [
      "Field Research Criticality: Direct observation of drivers and dispatch teams revealed insights that would have been missed through remote research, fundamentally shaping the solution to address real-world challenges.",
      "ELD Compliance Innovation: Regulatory requirements became opportunities for broader digital transformation, going beyond simple compliance to improve overall operational efficiency.",
      "Driver Experience Design: Mobile applications needed to accommodate various working conditions, from truck cabs to warehouse environments, requiring specialized interface design for usability.",
      "Cross-Platform Integration: Seamless communication between mobile driver apps and web dispatch tools proved crucial for operational efficiency and user adoption.",
    ],
    outcome:
      "EchoDrive achieved exceptional results across all key objectives. The platform successfully achieved 100% ELD Mandate compliance, eliminating manual logging processes. Operational improvements included 16% increase in LTL shipment revenues to $184.4 million and 12% increase in shipment volume through the self-serve booking application. User engagement exceeded targets with 1,000 beta downloads and over 10,000 active drivers post-launch. The solution demonstrated substantial growth from alpha through beta to launch phases while significantly streamlining internal processes and driver-dispatcher communication.",
    reflection:
      "Building EchoDrive validated that deep industry expertise combined with user-centered design can transform traditional logistics operations. The field research approach proved invaluable, revealing insights that shaped every aspect of the solution from mobile app interface design to communication workflow optimization. This project demonstrated that even in traditionally low-technology industries, thoughtful digital solutions can drive significant operational improvements and user adoption when they address real pain points and deliver clear value to all stakeholders.",
    stakeholderQuotes: [
      {
        quote:
          "EchoDrive transformed our logistics operations. The 16% revenue increase in LTL shipments demonstrates how digital solutions create real business value in traditional industries.",
        author: "Operations Director",
        role: "Echo Global Logistics",
      },
      {
        quote:
          "The mobile app made our drivers' jobs easier while improving compliance. 10,000+ active adoption shows we solved real problems, not just technology challenges.",
        author: "Fleet Manager",
        role: "Echo Global Logistics",
      },
      {
        quote:
          "The field research approach made all the difference. Understanding our drivers' needs in their actual work environment created a solution that truly works.",
        author: "Dispatch Team Lead",
        role: "Echo Global Logistics",
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
            Modern logistics platform transforming trucking operations through
            mobile innovation. Real-time shipment tracking, ELD compliance, and
            driver communication—achieving 16% revenue growth and 10,000+ active
            drivers.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
              Alpha → Beta → Launch
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Product Designer & Frontend Lead
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              Mobile-First
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
            <Truck className="h-4 w-4" />
            <span>Logistics Industry Impact</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {enhancedMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      </section>

      {/* Logistics Features */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Logistics Platform Features
          </h2>
          <Truck className="h-5 w-5 text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {logisticsFeatures.map((feature, index) => (
            <ProjectCard
              key={index}
              title={feature.title}
              description={feature.description}
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
                Field Research Approach
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
                Logistics Transformation Results
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
                      16%
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      LTL Revenue Increase
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900/50">
                    <div className="mb-1 text-2xl font-bold text-blue-600">
                      10,000+
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Active Drivers
                    </div>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900/50">
                    <div className="mb-1 text-2xl font-bold text-cyan-600">
                      100%
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      ELD Compliance
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
          Logistics Development Insights
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
          Driver & Operations Impact
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
          Product Design Leadership Reflection
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
            Explore More Projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Thank you for exploring EchoDrive&apos;s logistics innovation!
          </p>
        </div>
      </section>
    </main>
  );
}
